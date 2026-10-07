using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ApiKeyVault.Domain.Entities
{
    public class TeamRole
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is mandatory")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Name must be between 3 to 20 characters.")]
        public string Name { get; set; } = string.Empty;

        public List<TeamMember> Members { get; set; } = new List<TeamMember>();
    }
}
