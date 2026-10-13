using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamMemberRepository : ITeamMemberRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamMemberRepository(ApiKeyVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAsync(TeamMember teamMember)
        {
            await _dbContext.TeamMembers.AddAsync(teamMember);
        }
        public Task RemoveAsync(TeamMember teamMember)
        {
            _dbContext.TeamMembers.Remove(teamMember);

            return Task.CompletedTask;
        }
        public async Task<TeamMember?> GetByTeamAndUserAsync(int teamId, string userId)
        {
            return await _dbContext.TeamMembers
                .AsNoTracking()
                .Include(member => member.Role)
                .SingleOrDefaultAsync(member =>
                    member.TeamId == teamId &&
                    member.UserId == userId);
        }
        public async Task<List<TeamMember>> GetByTeamAsync(int teamId)
        {
            return await _dbContext.TeamMembers
                .AsNoTracking()
                .Include(member => member.Role)
                .Where(member => member.TeamId == teamId)
                .ToListAsync();
        }

        public void Update(TeamMember teamMember)
        {
            _dbContext.TeamMembers.Update(teamMember);
        }
        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

        public Task<TeamMember?> GetByIdAsync(int teamMemberId)
        {
            throw new NotImplementedException();
        }
    }
}
