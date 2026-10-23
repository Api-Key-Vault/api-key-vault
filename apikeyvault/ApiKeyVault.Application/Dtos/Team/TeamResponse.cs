
namespace ApiKeyVault.Application.Dtos.Team
{
	public class TeamResponse
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public int Members { get; set; }
		public int Keys { get; set; }
	}
}
