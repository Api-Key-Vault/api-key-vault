namespace ApiKeyVault.Application.Dtos.Team
{
	public class GetTeamResponse
	{
		public int Id { get; set; }

		public string Name { get; set; } = string.Empty;

		public DateTime CreatedAt { get; set; }
	}
}
