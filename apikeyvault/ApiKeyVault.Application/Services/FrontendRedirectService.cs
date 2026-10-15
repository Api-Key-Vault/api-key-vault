using ApiKeyVault.Application.Common.Options;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.Extensions.Options;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices.Marshalling;
using System.Text;

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
            string loginUrl = $"{_frontendOptions.Origin}{_frontendOptions.LoginPath}";

            if (!string.IsNullOrWhiteSpace(error))
            {
                string errorCode = Uri.EscapeDataString(error);
                return $"{loginUrl}?{LoginRedirectErrors.ParameterName}={errorCode}";
            }

            return loginUrl;
        }

        public string GetDashboardUrl()
        {
            string dashboardUrl = $"{_frontendOptions.Origin}{_frontendOptions.DashboardPath}";

            return dashboardUrl;
        }
    }
}
