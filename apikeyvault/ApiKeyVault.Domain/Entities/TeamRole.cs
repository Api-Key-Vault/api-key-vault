using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class TeamRole
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<TeamMember> Members { get; set; } = new List<TeamMember>();
    }
}
