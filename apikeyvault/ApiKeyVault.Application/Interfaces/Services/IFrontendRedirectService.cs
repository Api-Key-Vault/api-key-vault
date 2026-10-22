namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IFrontendRedirectService
    {
        string GetDashboardUrl();
        string GetHomeUrl(string? error = null);
        string GetInviteUrl(string token);
    }
}
