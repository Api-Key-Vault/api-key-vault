namespace ApiKeyVault.Application.Dtos.Authentication
{
    public class AuthenticatedUserDto
    {
        public string Id { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
    }
}
