namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IFrontendRedirectService
    {
        string GetDashboardUrl();
        string GetLoginUrl(string? error = null);
    }
}
