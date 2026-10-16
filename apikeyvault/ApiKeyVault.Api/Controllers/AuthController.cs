using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ApiKeyVault.Application.Constants;

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
        public IActionResult Login()
        {
            var callbackUrl = Url.Action(nameof(GitHubCallback), "Auth");

            if (callbackUrl is null)
            {
                return Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.LoginFailed));
            }

            var authenticationProperties = _signInManager.ConfigureExternalAuthenticationProperties("GitHub", callbackUrl);

            return Challenge(authenticationProperties, "GitHub");
        }

        [HttpGet("github/callback")]
        public async Task<IActionResult> GitHubCallback([FromQuery] string? error = null)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                return Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.LoginFailed));
            }

            var result = await _gitHubAuthenticationService.GitHubLoginAsync();

            return result switch
            {
                ExternalLoginResult.Success
                    => Redirect(_frontendRedirectService.GetDashboardUrl()),
                ExternalLoginResult.Invalid
                    => Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.InvalidLogin)),
                ExternalLoginResult.LockedOut
                    => Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.LockedOut)),
                ExternalLoginResult.NotAllowed
                    => Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.NotAllowed)),
                _ => Redirect(_frontendRedirectService.GetLoginUrl(LoginRedirectErrors.LoginFailed))
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
