using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

        public async Task<bool> RevokeAsync(int teamMemberId, int apiKeyId)
        {
            var hasAccess = await _dbContext.ApiKeyAccesses.FindAsync(apiKeyId, teamMemberId);

            if (hasAccess is null)
            {
                return false;
            }

            _dbContext.ApiKeyAccesses.Remove(hasAccess);

            return true; 
        }

        public async Task<bool> ExistsAsync(int teamMemberId, int apiKeyId)
        {
            return await _dbContext.ApiKeyAccesses.AnyAsync(access => access.TeamMemberId == teamMemberId && access.ApiKeyId == apiKeyId);
        }

        public Task<int> SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

        public Task<List<ApiKeyAccess>> GetByTeamMemberIdAsync(int teamMemberId)
        {
            throw new NotImplementedException();
        }
    }
}
