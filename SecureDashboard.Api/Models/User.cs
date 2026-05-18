using System.ComponentModel.DataAnnotations;

namespace SecureDashboard.Api.Models
{
    public class User
    {
        public Guid Id { get; set; }
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        // We explicitly name this PasswordHash to clarify our security mechanism
        public string PasswordHash { get; set; } = string.Empty;
        
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}