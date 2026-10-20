using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface IApiKeyRepository
    {
        Task<List<ApiKey>> GetByTeamAsync(int teamId);
        Task<ApiKey?> GetByIdAsync(int teamId, int apiKeyId);
        Task AddAsync(ApiKey apiKey);
        Task RemoveByTeamAsync(int teamId);
        void Update(ApiKey apiKey);
        Task SaveChangesAsync();
    }
}
