using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace ApiKeyVault.Infrastructure.Services
{
    public class GitHubAuthenticationService : IGitHubAuthenticationService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public GitHubAuthenticationService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<AuthenticatedUserDto> GetCurrentUserAsync(ClaimsPrincipal principal)
        {
            var user = await _userManager.GetUserAsync(principal);

            if (user is null)
            {
                return null;
            }

            return new AuthenticatedUserDto { DisplayName = user.DisplayName, Id = user.Id };
        }

        public async Task<ExternalLoginResult> GitHubLoginAsync()
        {
            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();

            if (externalLoginInfo is null || !string.Equals(externalLoginInfo.LoginProvider, "GitHub", StringComparison.OrdinalIgnoreCase))
            {
                return ExternalLoginResult.Invalid;
            }

            var signInResult = await _signInManager.ExternalLoginSignInAsync(externalLoginInfo.LoginProvider, externalLoginInfo.ProviderKey, isPersistent: true);

            if (signInResult.Succeeded)
            {
                return ExternalLoginResult.Success;
            }

            if (signInResult.IsLockedOut)
            {
                return ExternalLoginResult.LockedOut;
            }

            if (signInResult.IsNotAllowed)
            {
                return ExternalLoginResult.NotAllowed;
            }

            var user = new ApplicationUser
            {
                UserName = $"github-{externalLoginInfo.ProviderKey}",
                Email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email),
                DisplayName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Name) ?? $"GitHub user {externalLoginInfo.ProviderKey}"
            };

            var createUserResult = await _userManager.CreateAsync(user);

            if (!createUserResult.Succeeded)
            {
                return ExternalLoginResult.Failed;
            }

            var addLoginResult = await _userManager.AddLoginAsync(user, externalLoginInfo);

            if (!addLoginResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return ExternalLoginResult.Failed;
            }

            await _signInManager.SignInAsync(user, isPersistent: true);

            return ExternalLoginResult.Success;
        }

        public async Task SignOutAsync()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
