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

        public Task AddAsync(TeamMember teamMember)
        {
            throw new NotImplementedException();
        }
        public Task RemoveAsync(TeamMember teamMember)
        {
            throw new NotImplementedException();
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
        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
