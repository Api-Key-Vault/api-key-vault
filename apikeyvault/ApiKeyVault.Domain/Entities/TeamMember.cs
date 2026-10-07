using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class TeamMember
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public int TeamId { get; set; }       
        public int RoleId { get; set; }

        public Team Team { get; set; } = null!;
        public TeamRole Role { get; set; } = null!;
        public List<ApiKeyAccess> GrantedApiKeyAccesses { get; set; } = new List<ApiKeyAccess>();        
        public List<TeamInvite> CreatedInvites { get; set; } = new List<TeamInvite>();
        public List<TeamInvite> UsedInvites { get; set; } = new List<TeamInvite>();
        public List<ApiKeyAccess> CreatedApiKeyAccesses { get; set; } = new List<ApiKeyAccess>();
        public List<ApiKey> CreatedApiKeys { get; set; } = new List<ApiKey>();
    }
}
