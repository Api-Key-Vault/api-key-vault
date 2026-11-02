using ApiKeyVault.Api.Controllers;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task GitHubCallback_ExternalLoginResultInvalid_ReturnsRedirectUrl()
        {
            //Arrange
            string redirectUrl = "http://localhost:5173/?error=invalid_login";            
            var loginRedirectError = LoginRedirectErrors.InvalidLogin;

            var signInManager = new StubSignInManager();
            var gitHubAuthenticationService = new Mock<IGitHubAuthenticationService>();           
            var frontendRedirectService = new Mock<IFrontendRedirectService>();

            gitHubAuthenticationService
                .Setup(service => service.GitHubLoginAsync())
                .ReturnsAsync(ExternalLoginResult.Invalid);

            frontendRedirectService
                .Setup(service => service.GetHomeUrl(loginRedirectError))
                .Returns(redirectUrl);

            var authController = new AuthController(
                gitHubAuthenticationService.Object, 
                signInManager, 
                frontendRedirectService.Object);

            //Act
            var result = await authController.GitHubCallback(error: null);

            //Assert
            var redirectResult = Assert.IsType<RedirectResult>(result);
            Assert.Equal(redirectUrl, redirectResult.Url);
        }
        private sealed class StubSignInManager : SignInManager<ApplicationUser>
{
    public StubSignInManager()
        : base(
            CreateUserManager(),
            new HttpContextAccessor(),
            Mock.Of<IUserClaimsPrincipalFactory<ApplicationUser>>(),
            Microsoft.Extensions.Options.Options.Create(new IdentityOptions()),
            NullLogger<SignInManager<ApplicationUser>>.Instance,
            Mock.Of<IAuthenticationSchemeProvider>(),
            Mock.Of<IUserConfirmation<ApplicationUser>>())
    {
    }

    public override Task<ExternalLoginInfo?> GetExternalLoginInfoAsync(
        string? expectedXsrf = null)
    {
        return Task.FromResult<ExternalLoginInfo?>(null);
    }

    private static UserManager<ApplicationUser> CreateUserManager()
    {
        return new UserManager<ApplicationUser>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            Microsoft.Extensions.Options.Options.Create(new IdentityOptions()),
            Mock.Of<IPasswordHasher<ApplicationUser>>(),
            Array.Empty<IUserValidator<ApplicationUser>>(),
            Array.Empty<IPasswordValidator<ApplicationUser>>(),
            Mock.Of<ILookupNormalizer>(),
            new IdentityErrorDescriber(),
            Mock.Of<IServiceProvider>(),
            NullLogger<UserManager<ApplicationUser>>.Instance);
    }
}
    }
}
