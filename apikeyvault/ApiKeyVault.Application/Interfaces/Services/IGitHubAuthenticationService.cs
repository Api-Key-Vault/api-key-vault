using ApiKeyVault.Application.Dtos.Authentication;
using System.Security.Claims;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IGitHubAuthenticationService
    {
        Task<AuthenticatedUserDto> GetCurrentUserAsync(ClaimsPrincipal principal);
        Task<ExternalLoginResult> GitHubLoginAsync();
        Task SignOutAsync();
    }
}
