using System.ComponentModel.DataAnnotations;

namespace ApiKeyVault.Application.Dtos.Team
{
    public class CreateTeamRequest
    {
        [Required]
        public required string Name { get; set; } = string.Empty;
    }
}
