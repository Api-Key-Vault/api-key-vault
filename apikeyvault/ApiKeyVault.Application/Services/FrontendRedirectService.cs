using ApiKeyVault.Application.Common.Options;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.Extensions.Options;

namespace ApiKeyVault.Application.Services
{
    public class FrontendRedirectService : IFrontendRedirectService
    {
        private readonly FrontendOptions _frontendOptions;

        public FrontendRedirectService(IOptions<FrontendOptions> frontendOptions)
        {
            _frontendOptions = frontendOptions.Value;
        }

        public string GetHomeUrl(string? error = null)
        {
            var homeUrl = $"{_frontendOptions.Origin}";

            if (!string.IsNullOrWhiteSpace(error))
            {
                var errorCode = Uri.EscapeDataString(error);
                return $"{homeUrl}?{LoginRedirectErrors.ParameterName}={errorCode}";
            }

            return homeUrl;
        }

        public string GetDashboardUrl()
        {
            return $"{_frontendOptions.Origin}{_frontendOptions.DashboardPath}";
        }

        public string GetInviteUrl(string token)
        {
            var encodedToken = Uri.EscapeDataString(token);
            return $"{_frontendOptions.Origin}{_frontendOptions.InvitePath}?token={encodedToken}";
        }
    }
}
