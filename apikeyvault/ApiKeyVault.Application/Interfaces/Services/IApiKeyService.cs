using ApiKeyVault.Application.Dtos.ApiKey;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface IApiKeyService
    {
        Task<List<ApiKeyResponse>> GetByTeamAsync(int teamId, string userId);
        Task<ApiKeyResponse?> GetByIdAsync(int teamId, int apiKeyId, string userId);
        Task<ApiKeyResponse?> CreateAsync(int teamId, string userId, CreateApiKeyRequest request);
        Task<ApiKeyResponse?> UpdateAsync(int teamId, int apiKeyId, string userId, UpdateApiKeyRequest request);
        Task<RevealApiKeyResponse?> RevealAsync(int teamId, int apiKeyId, string userId);
        Task<bool> RevokeAsync(int teamId, int apiKeyId, string userId);
    }
}
