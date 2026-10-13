namespace ApiKeyVault.Application.Dtos.ApiKeyAccess
{
    public class GrantApiKeyAccessRequest
    {
        public int ApiKeyId { get; set; }
        public int TeamMemberId { get; set; }
    }
}
