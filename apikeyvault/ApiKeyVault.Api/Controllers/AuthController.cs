using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ApiKeyVault.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IGitHubAuthenticationService _gitHubAuthenticationService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IFrontendRedirectService _frontendRedirectService;

        public AuthController(IGitHubAuthenticationService gitHubAuthenticationService, SignInManager<ApplicationUser> signInManager, IFrontendRedirectService frontendRedirectService)
        {
            _gitHubAuthenticationService = gitHubAuthenticationService;
            _signInManager = signInManager;
            _frontendRedirectService = frontendRedirectService;
        }

        [HttpGet("github")]
        public IActionResult Login([FromQuery] string? token = null)
        {
            var callbackUrl = Url.Action(nameof(GitHubCallback), "Auth");

            if (callbackUrl is null)
            {
                return Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.LoginFailed));
            }

            var authenticationProperties = _signInManager.ConfigureExternalAuthenticationProperties("GitHub", callbackUrl);

            if (!string.IsNullOrWhiteSpace(token))
            {
                authenticationProperties.Items["invite_token"] = token;
            }

            return Challenge(authenticationProperties, "GitHub");
        }

        [HttpGet("github/callback")]
        public async Task<IActionResult> GitHubCallback([FromQuery] string? error = null)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                return Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.LoginFailed));
            }

            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();

            string? token = null;

            if (externalLoginInfo?.AuthenticationProperties != null)
            {
                externalLoginInfo.AuthenticationProperties.Items.TryGetValue(
                        "invite_token",
                        out token
                    );
            }

            var result = await _gitHubAuthenticationService.GitHubLoginAsync();

            var redirectUrl = _frontendRedirectService.GetDashboardUrl();

            if (!string.IsNullOrWhiteSpace(token))
            {
                redirectUrl = _frontendRedirectService.GetInviteUrl(token);
            }

            return result switch
            {
                ExternalLoginResult.Success
                    => Redirect(redirectUrl),
                ExternalLoginResult.Invalid
                    => Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.InvalidLogin)),
                ExternalLoginResult.LockedOut
                    => Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.LockedOut)),
                ExternalLoginResult.NotAllowed
                    => Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.NotAllowed)),
                _ => Redirect(_frontendRedirectService.GetHomeUrl(LoginRedirectErrors.LoginFailed))
            };
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserAsync()
        {
            var user = await _gitHubAuthenticationService.GetCurrentUserAsync(User);

            if (user is null)
            {
                return Unauthorized();
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _gitHubAuthenticationService.SignOutAsync();

            return NoContent();
        }
    }
}
