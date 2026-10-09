namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IApiKeyProtector
    {
        string Protect(string value);
        string Unprotect(string protectedValue);
    }
}
