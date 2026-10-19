using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class ApiKeyRepository : IApiKeyRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public ApiKeyRepository(ApiKeyVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ApiKey>> GetByTeamAsync(int teamId)
        {
            return await _dbContext.ApiKeys
                .AsNoTracking()
                .Include(apiKey => apiKey.ApiKeyAccesses)
                .Where(apiKey => apiKey.TeamId == teamId)
                .OrderBy(apiKey => apiKey.Name)
                .ToListAsync();
        }

        public async Task<ApiKey?> GetByIdAsync(int teamId, int apiKeyId)
        {
            return await _dbContext.ApiKeys
                .AsNoTracking()
                .Include(apiKey => apiKey.ApiKeyAccesses)
                .SingleOrDefaultAsync(apiKey =>
                    apiKey.TeamId == teamId &&
                    apiKey.Id == apiKeyId);
        }

        public async Task AddAsync(ApiKey apiKey)
        {
            await _dbContext.ApiKeys.AddAsync(apiKey);
        }

        public async Task RemoveByTeamAsync(int teamId)
        {
            var apiKeys = await _dbContext.ApiKeys
                .Where(apiKey => apiKey.TeamId == teamId)
                .ToListAsync();

            _dbContext.ApiKeys.RemoveRange(apiKeys);
        }

        public void Update(ApiKey apiKey)
        {
            _dbContext.ApiKeys.Update(apiKey);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
