using ApiKeyVault.Application.Dtos.ApiKeyAccess;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IApiKeyAccessService
    {
        Task<ApiKeyAccessResponse?> CreateAsync(int teamId, string userId, GrantApiKeyAccessRequest request);
        Task<bool> RevokeAsync(int teamId, string userId, int apiKeyId, int teamMemberId);
    }
}
