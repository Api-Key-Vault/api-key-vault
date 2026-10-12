using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class ApiKeyAccessRepository : IApiKeyAccessRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;
        public ApiKeyAccessRepository(ApiKeyVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddAsync(ApiKeyAccess apiKeyAccess)
        {
            await _dbContext.ApiKeyAccesses.AddAsync(apiKeyAccess);
        }

        public async Task<bool> DeleteAsync(int teamMemberId, int apiKeyId)
        {
            var hasAccess = await _dbContext.ApiKeyAccesses.FindAsync(apiKeyId, teamMemberId);

            if (hasAccess is null)
            {
                return false;
            }

            _dbContext.ApiKeyAccesses.Remove(hasAccess);

            return true; 
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
