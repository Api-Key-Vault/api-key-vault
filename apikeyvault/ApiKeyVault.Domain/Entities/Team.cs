using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class Team
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<TeamMember> Members { get; set; } = new List<TeamMember>();
        public List<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();
        public List<TeamInvite> Invites { get; set; } = new List<TeamInvite>();
    }
}
