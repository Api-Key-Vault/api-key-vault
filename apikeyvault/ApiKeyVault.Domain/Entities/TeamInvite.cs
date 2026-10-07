using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class TeamInvite
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        [Required]
        [MaxLength(255)]
        public string TokenHash { get; set; } = string.Empty;

        public int TeamId { get; set; }
        public int CreatedByMemberId{ get; set; }
        public int? UsedByMemberId { get; set; }

        public Team Team { get; set; } = null!;
        public TeamMember CreatedByMember { get; set; } = null!;
        public TeamMember? UsedByMember { get; set; } = null!;
    }
}
