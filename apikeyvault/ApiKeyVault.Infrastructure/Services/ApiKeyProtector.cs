using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.DataProtection;

namespace ApiKeyVault.Infrastructure.Services
{
    public class ApiKeyProtector : IApiKeyProtector
    {
        private const string ProtectorPurpose = "ApiKeyVault.ApiKeys";

        private readonly IDataProtector _protector;

        public ApiKeyProtector(IDataProtectionProvider dataProtectionProvider)
        {
            _protector = dataProtectionProvider.CreateProtector(ProtectorPurpose);
        }

        public string Protect(string value)
        {
            ArgumentException.ThrowIfNullOrEmpty(value);

            return _protector.Protect(value);
        }

        public string Unprotect(string protectedValue)
        {
            ArgumentException.ThrowIfNullOrEmpty(protectedValue);

            return _protector.Unprotect(protectedValue);
        }
    }
}
