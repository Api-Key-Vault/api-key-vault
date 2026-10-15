using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamRepository(ApiKeyVaultDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

		public async Task<Team?> GetTeamByIdAsync(int teamId)
		{
			return await _dbContext.Teams
				.AsNoTracking()
				.SingleOrDefaultAsync(team => team.Id == teamId);
		}
		public async Task<List<Team>> GetAllTeamsAsync()
		{
			return await _dbContext.Teams
				.AsNoTracking()
				.OrderByDescending(t => t.CreatedAt)
				.ToListAsync();
		}

		public async Task AddTeamAsync(Team teamToAdd)
        {
            await _dbContext.Teams.AddAsync(teamToAdd);

		}
		public Task SaveChangesAsync()
		{
			return _dbContext.SaveChangesAsync();
		}

	}
}
