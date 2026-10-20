using ApiKeyVault.Application.Dtos.Team;
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
				.Include(t => t.Members)
				.ThenInclude(m => m.Role)
				.SingleOrDefaultAsync(team => team.Id == teamId && team.Members.Any(m => m.UserId == userId)); 
		}

		public async Task<Team?> GetTeamForDeletionAsync(int teamId, string userId)
		{
			return await _dbContext.Teams
				.SingleOrDefaultAsync(team =>
					team.Id == teamId &&
					team.Members.Any(member =>
						member.UserId == userId &&
						member.Role.Name == "Owner"));
		}
		public async Task<List<TeamResponse>> GetAllTeamsByUserIdAsync(string userId)
		{
			return await _dbContext.TeamMembers
				.AsNoTracking()
				.Where(tm => tm.UserId == userId)
				.OrderByDescending(tm => tm.Team.CreatedAt)
				.Select(tm => new TeamResponse
				{
					Id = tm.Team.Id,
					Name = tm.Team.Name,
					Members = tm.Team.Members.Count,
					Keys = tm.Team.ApiKeys
						.Count(ak => ak.ApiKeyAccesses.Any(a => a.TeamMemberId == tm.Id))
				}).ToListAsync();
		}

		public async Task AddTeamAsync(Team teamToAdd)
        {
            await _dbContext.Teams.AddAsync(teamToAdd);
		}

		public void DeleteTeam(Team teamToDelete)
		{
			_dbContext.Teams.Remove(teamToDelete);
		}

		public Task SaveChangesAsync()
		{
			return _dbContext.SaveChangesAsync();
		}

	}
}
