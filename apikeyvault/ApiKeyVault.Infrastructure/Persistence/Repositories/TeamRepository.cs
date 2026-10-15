using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.ClientModel.Primitives;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamRepository(ApiKeyVaultDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

		public async Task<Team?> GetTeamByIdAsync(int teamId, string userId)
		{
			return await _dbContext.Teams
				.AsNoTracking()
				.SingleOrDefaultAsync(team => team.Id == teamId && team.Members.Any(m => m.UserId == userId));
		}
		public async Task<List<Team>> GetAllTeamsAsync(string userId)
		{
			return await _dbContext.Teams
				.AsNoTracking()
				.Where(t => t.Members.Any(m => m.UserId == userId))
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
