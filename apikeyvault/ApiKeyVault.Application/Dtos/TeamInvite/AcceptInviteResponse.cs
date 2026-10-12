namespace ApiKeyVault.Application.Dtos.TeamInvite
{
    public class AcceptInviteResponse
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
    }
}
