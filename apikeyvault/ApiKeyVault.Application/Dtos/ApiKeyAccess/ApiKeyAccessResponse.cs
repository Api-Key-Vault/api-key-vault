namespace ApiKeyVault.Application.Dtos.ApiKeyAccess
{
    public class ApiKeyAccessResponse
    {
        public int ApiKeyId { get; set; }
        public int TeamMemberId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public DateTime AssignedAt { get; set; }
        public int GrantedByMemberId { get; set; }
    }
}
