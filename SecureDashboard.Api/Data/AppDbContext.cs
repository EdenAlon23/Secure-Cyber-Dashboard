using Microsoft.EntityFrameworkCore;
using SecureDashboard.Api.Models;

namespace SecureDashboard.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<SecurityEvent> SecurityEvents { get; set; }
    }
}