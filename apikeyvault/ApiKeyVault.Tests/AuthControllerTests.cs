using ApiKeyVault.Api.Controllers;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Dtos.Authentication;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task GitHubCallback_ExternalLoginResultInvalid_ReturnsRedirectUrl()
        {
            //Arrange
            string redirectUrl = "http://localhost:5173//login/?error=invalid_login";
            var externalLoginResult = ExternalLoginResult.Invalid;
            var loginRedirectError = LoginRedirectErrors.InvalidLogin;
            var frontendRedirectService = new Mock<IFrontendRedirectService>();
            var gitHubAuthenticationService = new Mock<IGitHubAuthenticationService>();           

            gitHubAuthenticationService
                .Setup(service => service.GitHubLoginAsync())
                .ReturnsAsync(externalLoginResult);

            frontendRedirectService
                .Setup(service => service.GetLoginUrl(loginRedirectError))
                .Returns(redirectUrl);

            var authController = new AuthController(gitHubAuthenticationService.Object, null!, frontendRedirectService.Object);

            //Act
            var result = await authController.GitHubCallback();

            //Assert
            var redirectResult = Assert.IsType<RedirectResult>(result);
            Assert.Equal(redirectUrl, redirectResult.Url);
        }
    }
}
