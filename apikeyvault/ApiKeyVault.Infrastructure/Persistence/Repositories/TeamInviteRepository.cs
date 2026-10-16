using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamInviteRepository : ITeamInviteRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamInviteRepository(ApiKeyVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddTeamInviteAsync(TeamInvite teamInvite)
        {
            await _dbContext.TeamInvites.AddAsync(teamInvite);
        }

        public async Task<TeamInvite?> GetByTokenHashAsync(string tokenHash)
        {
            return await _dbContext.TeamInvites
                .AsNoTracking()
                .Include(ti => ti.Team)
                .FirstOrDefaultAsync(ti => ti.TokenHash == tokenHash);
        }

        public async Task<bool> MarkInviteAsUsedAsync(int teamInviteId, int usedByMemberId)
        {
            var now = DateTime.UtcNow;

            var rowsAffected = await _dbContext.TeamInvites
                .Where(ti => ti.Id == teamInviteId
                    && ti.UsedByMemberId == null
                    && ti.ExpiresAt > now)
                .ExecuteUpdateAsync(s => s.SetProperty(ti => ti.UsedByMemberId, usedByMemberId));

            return rowsAffected > 0;
        }

        public async Task RemoveUsedInvitesAsync(int teamMemberId)
        {
            var invites = await _dbContext.TeamInvites
                .Where(ti => ti.UsedByMemberId == teamMemberId)
                .ToListAsync();

            _dbContext.TeamInvites.RemoveRange(invites);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}