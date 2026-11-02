using ApiKeyVault.Application.ReadModels;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface IApiKeyAccessRepository
    {
        Task AddAsync(ApiKeyAccess apiKeyAccess);
        Task<bool> RevokeAsync(int teamMemberId, int apiKeyId);
        Task<List<ApiKeyAccess>> GetByTeamMemberIdAsync(int teamMemberId);
        Task<List<ApiKeyAccessReadModel>> GetByApiKeyAsync(int apiKeyId);
        Task<ApiKeyAccessReadModel?> GetByApiKeyAndMemberAsync(int apiKeyId, int teamMemberId);
        Task<bool> ExistsAsync(int teamMemberId, int apiKeyId);
        Task<int> SaveChangesAsync();
    }
}
