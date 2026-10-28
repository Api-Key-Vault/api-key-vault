using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.ReadModels;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IApiKeyAccessService
    {
        Task<ApiKeyAccessServiceResponse> CreateAsync(int teamId, string userId, GrantApiKeyAccessRequest request);
        Task<bool> RevokeAsync(int teamId, string userId, int apiKeyId, int teamMemberId);
        Task<List<ApiKeyAccessResponse>?> GetByApiKeyAsync(int teamId, string userId, int apiKeyId);
    }
}
