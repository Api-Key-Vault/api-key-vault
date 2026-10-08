namespace ApiKeyVault.Application.Dtos.Authentication
{
    public class AuthenticatedUserDto
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
