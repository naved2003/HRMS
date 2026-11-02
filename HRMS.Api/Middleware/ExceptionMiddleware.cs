using System.Net;
using System.Text.Json;

namespace HRMS.Api.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Path}", context.Request.Path);
            await WriteProblemDetailsAsync(context, ex);
        }
    }

    private static async Task WriteProblemDetailsAsync(HttpContext context, Exception ex)
    {
        var status = ex switch
        {
            ArgumentException => HttpStatusCode.BadRequest,
            InvalidOperationException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            _ => HttpStatusCode.InternalServerError,
        };

        var problem = new
        {
            type = "https://httpstatuses.io/" + (int)status,
            title = ex.GetType().Name,
            status = (int)status,
            detail = ex.Message,
            instance = context.Request.Path
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;
        var json = JsonSerializer.Serialize(problem);
        await context.Response.WriteAsync(json);
    }
}
