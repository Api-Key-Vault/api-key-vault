using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
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

        public AuthController(IGitHubAuthenticationService gitHubAuthenticationService, SignInManager<ApplicationUser> signInManager)
        {
            _gitHubAuthenticationService = gitHubAuthenticationService;
            _signInManager = signInManager;
        }

        [HttpGet("github")]
        public IActionResult Login()
        {
            var callbackUrl = Url.Action(nameof(GitHubCallback), "Auth");

            if (callbackUrl is null)
            {
                return Problem("GitHub oauth callbackUrl could not be created");
            }

            var authenticationProperties = _signInManager.ConfigureExternalAuthenticationProperties("GitHub", callbackUrl);

            return Challenge(authenticationProperties, "GitHub");
        }

        [HttpGet("github/callback")]
        public async Task<IActionResult> GitHubCallback([FromQuery] string? error = null)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                return Unauthorized();
            }

            var result = await _gitHubAuthenticationService.GitHubLoginAsync();

            return result switch
            {
                ExternalLoginResult.Success
                    => NoContent(),
                ExternalLoginResult.Invalid
                    => Unauthorized(),
                ExternalLoginResult.LockedOut
                    => Forbid(),
                ExternalLoginResult.NotAllowed
                    => Unauthorized(),
                _ => BadRequest()
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
