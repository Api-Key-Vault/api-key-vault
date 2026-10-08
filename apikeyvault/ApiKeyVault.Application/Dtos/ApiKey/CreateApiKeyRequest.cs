using System.ComponentModel.DataAnnotations;

namespace ApiKeyVault.Application.Dtos.ApiKey
{
    public class CreateApiKeyRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Value { get; set; } = string.Empty;
        [StringLength(50, MinimumLength = 3)]
        public string? Category { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
