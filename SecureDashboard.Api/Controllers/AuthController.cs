using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureDashboard.Api.Data;
using SecureDashboard.Api.DTOs;
using SecureDashboard.Api.Models;
using BCrypt.Net;

namespace SecureDashboard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Security Best Practice: Check if the user already exists to prevent duplicate accounts.
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                // We return a generic message to prevent "Account Enumeration" attacks.
                // We don't want attackers to know which emails exist in our system.
                return BadRequest(new { Message = "Registration failed. Please check your details." });
            }

            // Security Best Practice: Hash the password using BCrypt.
            // The library automatically generates a strong cryptographic salt.
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User" // Default role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }
    }
}