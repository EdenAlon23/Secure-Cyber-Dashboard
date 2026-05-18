using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureDashboard.Api.Data;

namespace SecureDashboard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // INTERVIEW TALKING POINT: 
    // This attribute enforces RBAC. Only users with a valid JWT containing the 'Admin' role can access this.
    [Authorize(Roles = "Admin")]
    public class SecurityLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SecurityLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSecurityLogs()
        {
            // Fetch the latest 50 security events, ordered by newest first
            var logs = await _context.SecurityEvents
                .OrderByDescending(e => e.Timestamp)
                .Take(50)
                .ToListAsync();

            return Ok(logs);
        }
    }
}