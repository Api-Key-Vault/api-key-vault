namespace ApiKeyVault.Application.Dtos.ApiKey
{
    public class ApiKeyResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
