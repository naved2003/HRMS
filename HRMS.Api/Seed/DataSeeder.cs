using HRMS.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HRMS.Infrastructure;

namespace HRMS.Api.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider provider)
    {
        var roleMgr = provider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userMgr = provider.GetRequiredService<UserManager<ApplicationUser>>();
        var db = provider.GetRequiredService<HRMSDbContext>();

        await db.Database.MigrateAsync();

        string[] roles = { "Admin", "HR", "Manager" };
        foreach (var role in roles)
        {
            if (!await roleMgr.RoleExistsAsync(role))
                await roleMgr.CreateAsync(new IdentityRole<int>(role));
        }

        var adminEmail = "admin@hrms.local";
        var adminUser = await userMgr.FindByEmailAsync(adminEmail);
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                HireDate = DateTime.UtcNow,
                IsActive = true
            };
            var result = await userMgr.CreateAsync(adminUser, "Admin@123456");
            if (result.Succeeded)
            {
                await userMgr.AddToRoleAsync(adminUser, "Admin");
            }
        }
        else if (!await userMgr.IsInRoleAsync(adminUser, "Admin"))
        {
            await userMgr.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
