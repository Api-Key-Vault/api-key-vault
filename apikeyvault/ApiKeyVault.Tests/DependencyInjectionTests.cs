using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests
{
    public class DependencyInjectionTests
    {
        [Fact]
        public void RedirectToFrontend_EventWithAccessDeniedFromGitHub_ReturnsRedirectUrlWithErrorParam()
        {
            //Arrange
            string redirectUrl = "http://localhost:5173//login/?error=access_denied";
            var loginRedirectError = LoginRedirectErrors.AccessDenied; 
            
            var frontendRedirectService = new Mock<IFrontendRedirectService>();
            var serviceProvider = new Mock<IServiceProvider>();
            var httpContext = new Mock<HttpContext>();
            var httpResponse = new Mock<HttpResponse>();           

            frontendRedirectService
                .Setup(service => service.GetLoginUrl(loginRedirectError))
                .Returns(redirectUrl);

            serviceProvider
                .Setup(provider => provider.GetService(typeof(IFrontendRedirectService)))
                .Returns(frontendRedirectService.Object);          

            //Act
            DependencyInjection.RedirectToFrontendLogin(httpResponse.Object, serviceProvider.Object, loginRedirectError);

            //Assert
            httpResponse.Verify(response => response.Redirect(redirectUrl));  
        }
    }
}
