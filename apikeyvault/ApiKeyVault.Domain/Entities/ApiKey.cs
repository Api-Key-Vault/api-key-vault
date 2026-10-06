using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class ApiKey
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string EncryptedValue { get; set; } = string.Empty;
        public string? Category { get; set; } 
        public DateTime ExpiresAt { get; set; }
        public DateTime RevokedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TeamId { get; set; }
        public int CreatedByMemberId { get; set; }

        public Team Team { get; set; } = null!;
        public TeamMember CreatedByMember { get; set; } = null!;
        public List<ApiKeyAccess> ApiKeyAccesses { get; set; } = new List<ApiKeyAccess>();

    }
}
