using SecureDashboard.Api.Data;
using SecureDashboard.Api.Models;

namespace SecureDashboard.Api.Middlewares
{
    public class SecurityLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;

        // We use IServiceScopeFactory because Middleware is Singleton, but our AppDbContext is Scoped.
        public SecurityLoggingMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Let the request pass through the pipeline first
            await _next(context);

            // After the request is processed, check if it was a security violation (401 or 429)
            if (context.Response.StatusCode == StatusCodes.Status401Unauthorized ||
                context.Response.StatusCode == StatusCodes.Status429TooManyRequests)
            {
                string eventType = context.Response.StatusCode == 401
                    ? "Failed Login Attempt"
                    : "Brute Force / Rate Limit Triggered";
                string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP";
                string path = context.Request.Path;

                // We only care about logging attacks on our authentication endpoints
                if (path.StartsWith("/api/auth"))
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var securityEvent = new SecurityEvent
                        {
                            EventType = eventType,
                            IpAddress = ipAddress,
                            Description = $"Target: {path}",
                            Timestamp = DateTime.UtcNow
                        };

                        dbContext.SecurityEvents.Add(securityEvent);
                        await dbContext.SaveChangesAsync();
                    }
                }
            }
        }
    }
}