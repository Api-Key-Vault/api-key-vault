namespace ApiKeyVault.Application.Dtos.ApiKeyAccess
{
    public class ApiKeyAccessResponse
    {
        public int ApiKeyId { get; set; }
        public int TeamMemberId { get; set; }
        public int GrantedByMemberId { get; set; }
    }
}
