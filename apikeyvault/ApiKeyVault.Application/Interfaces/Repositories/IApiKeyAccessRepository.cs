using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface IApiKeyAccessRepository
    {
        Task AddAsync(ApiKeyAccess apiKeyAccess);
        Task<bool> DeleteAsync(int teamMemberId, int apiKeyId);
        Task SaveChangesAsync();
    }
}
