using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamRoleRepository : ITeamRoleRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamRoleRepository(ApiKeyVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<TeamRole?> GetRoleByNameAsync(string name)
        {
            return await _dbContext.Set<TeamRole>()
                .AsNoTracking()
                .FirstOrDefaultAsync(tr => tr.Name == name);
        }
    }
}