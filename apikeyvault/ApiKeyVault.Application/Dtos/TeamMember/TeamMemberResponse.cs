namespace ApiKeyVault.Application.Dtos.TeamMember
{
    public class TeamMemberResponse
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TeamId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
    }
}