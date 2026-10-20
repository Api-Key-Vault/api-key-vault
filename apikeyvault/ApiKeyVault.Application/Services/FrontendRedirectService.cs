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

        public string GetLoginUrl(string? error = null)
        {
            var loginUrl = $"{_frontendOptions.Origin}";

            if (!string.IsNullOrWhiteSpace(error))
            {
                var errorCode = Uri.EscapeDataString(error);
                return $"{loginUrl}?{LoginRedirectErrors.ParameterName}={errorCode}";
            }

            return loginUrl;
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
