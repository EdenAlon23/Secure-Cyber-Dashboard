namespace SecureDashboard.Api.Models
{
    public class SecurityEvent
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}