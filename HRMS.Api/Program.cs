using HRMS.Core.Entities;
using HRMS.Infrastructure;
using HRMS.Services.Mappings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HRMS.Api.Extensions;
using HRMS.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<HRMSDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
    options.Lockout.MaxFailedAccessAttempts = 5;
})
.AddEntityFrameworkStores<HRMSDbContext>()
.AddDefaultTokenProviders();

// Cookie config
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.AccessDeniedPath = "/api/auth/access-denied";
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    // SameAsRequest lets the cookie be sent over HTTP in development
    // (no Secure flag) and over HTTPS in production (Secure flag set).
    // "Always" would force Secure which the browser would reject on HTTP localhost.
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    // Lax is required for HTTP localhost (SameSite=None requires Secure).
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.Name = "HRMS.Auth";
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = _ => false;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

// MVC Controllers + JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = false;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Serialize + deserialize enums as strings ("Male" / "Active") instead of numbers (0 / 1).
        // The Angular frontend uses string enums (enum Gender { Male = 'Male', ... }),
        // so the API must accept string values in [FromBody] DTOs and return strings in responses.
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase, allowIntegerValues: true));
    });

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("AdminOrHR", p => p.RequireRole("Admin", "HR"));
    options.AddPolicy("AdminOrHRorManager", p => p.RequireRole("Admin", "HR", "Manager"));
});

// Application services
builder.Services.AddApplicationServices();

// HttpContext + Swagger
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "HRMS API",
        Version = "v1",
        Description = "Human Resource Management System API. Authentication is cookie-based (ASP.NET Identity)."
    });
});

builder.Services.Configure<CookiePolicyOptions>(o => o.MinimumSameSitePolicy = SameSiteMode.None);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "HRMS API v1"));
}

app.UseMiddleware<ExceptionMiddleware>();

// Only enforce HTTPS in production. In development we run on plain HTTP
// (http://localhost:5000) so UseHttpsRedirection would 307-redirect every
// /api/* call to https://localhost:5001 which isn't listening when the
// user picks the "http" launch profile — that broke Swagger "Try it out"
// and the Angular dev-server proxy with TypeError: NetworkError / ECONNREFUSED.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AngularPolicy");
app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallback(() => Results.NotFound(new { message = "Resource not found." }));

// Seed default roles + admin user on first run
using (var scope = app.Services.CreateScope())
{
    var sp = scope.ServiceProvider;
    try
    {
        await HRMS.Api.Seed.DataSeeder.SeedAsync(sp);
    }
    catch (Exception ex)
    {
        var logger = sp.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();

public partial class Program { }
