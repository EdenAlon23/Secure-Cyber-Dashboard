using System.ComponentModel.DataAnnotations;

namespace SecureDashboard.Api.DTOs
{
    public class RegisterDto
    {
        [Required] [EmailAddress] public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")] // rule 1: password must be at least 8 characters long
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.")] // rule 2: password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
        public string Password { get; set; } = string.Empty;
    }
}