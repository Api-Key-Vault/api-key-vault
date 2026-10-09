using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamInviteRepository : ITeamInviteRepository
    {
        public Task<TeamInvite> AddTeamInviteAsync(TeamInvite teamInvite)
        {
            throw new NotImplementedException();
        }

        public Task<TeamInvite?> GetByTokenHashAsync(string tokenHash)
        {
            throw new NotImplementedException();
        }

        public Task<bool> MarkInviteAsUsedAsync(int teamInviteId, int usedByMemberId)
        {
            throw new NotImplementedException();
        }
    }
}