namespace ApiKeyVault.Domain.Entities
{
    public class ApiKeyAccess
    {
        public int ApiKeyId { get; set; }
        public int TeamMemberId { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public int GrantedByMemberId { get; set; }

        public ApiKey ApiKey { get; set; } = null!;
        public TeamMember Member { get; set; } = null!;
        public TeamMember GrantedByMember { get; set; } = null!;
    }
}
