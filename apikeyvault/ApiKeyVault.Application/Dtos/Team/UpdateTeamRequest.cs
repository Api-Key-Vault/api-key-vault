using System.ComponentModel.DataAnnotations;


namespace ApiKeyVault.Application.Dtos.Team
{
	public class UpdateTeamRequest
	{
			[Range(1, int.MaxValue)]
			public int Id { get; set; }

			[Required(ErrorMessage = "Name is mandatory")]
			[StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 to 50 characters.")]
			public string Name { get; set; } = string.Empty;
		}
	}
