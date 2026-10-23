using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.ReadModels;
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

        public async Task<TeamMember?> GetByIdAsync(int teamMemberId)
        {
            return await _dbContext.TeamMembers
                .AsNoTracking()
                .Include(member => member.Role)
                .SingleOrDefaultAsync(member => member.Id == teamMemberId);
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

        public async Task<List<TeamMemberReadModel>> GetByTeamAsync(int teamId)
        {
            return await _dbContext.TeamMembers
                .AsNoTracking()
                .Where(member => member.TeamId == teamId)
                .Join(_dbContext.Users,
                    member => member.UserId,
                    user => user.Id,
                    (member, user) => new TeamMemberReadModel
                    {
                        Id = member.Id,
                        UserId = member.UserId,
                        TeamId = member.TeamId,
                        RoleName = member.Role.Name,
                        DisplayName = user.DisplayName
                    })
                .ToListAsync();
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

        public Task<int> SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
