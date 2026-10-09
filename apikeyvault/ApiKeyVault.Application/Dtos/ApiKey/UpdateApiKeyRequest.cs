using System.ComponentModel.DataAnnotations;

namespace ApiKeyVault.Application.Dtos.ApiKey
{
    public class UpdateApiKeyRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [MinLength(1)]
        public string? Value { get; set; }
        [StringLength(50, MinimumLength = 3)]
        public string? Category { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
