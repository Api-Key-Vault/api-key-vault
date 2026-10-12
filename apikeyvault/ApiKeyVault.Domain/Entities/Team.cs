using System.ComponentModel.DataAnnotations;


namespace ApiKeyVault.Domain.Entities
{
    public class Team
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is mandatory")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 to 50 characters.")]
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } 

        public List<TeamMember> Members { get; set; } = new List<TeamMember>();
        public List<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();
        public List<TeamInvite> Invites { get; set; } = new List<TeamInvite>();
    }
}
