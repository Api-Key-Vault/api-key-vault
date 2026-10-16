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

		public async Task<Team?> GetTeamByIdAsync(int teamId, string userId)
		{
			return await _dbContext.Teams
				.AsNoTracking()
				.Include(t => t.Members)
				.SingleOrDefaultAsync(team => team.Id == teamId && team.Members.Any(m => m.UserId == userId)); 
		}
		public async Task<List<Team>> GetAllTeamsByUserIdAsync(string userId)
		{
			return await _dbContext.TeamMembers
				.AsNoTracking()
				.Include(tm => tm.Team)
				.Where(tm => tm.UserId == userId)
				.Select(tm => tm.Team)
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
