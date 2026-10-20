using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamInviteRepository
    {
        Task AddTeamInviteAsync(TeamInvite teamInvite);
        Task<TeamInvite?> GetByTokenHashAsync(string tokenHash); 
        Task<bool> MarkInviteAsUsedAsync(int teamInviteId, int usedByMemberId);
        Task RemoveByTeamAsync(int teamId);
        Task RemoveUsedInvitesAsync(int teamMemberId);
        Task SaveChangesAsync();
    }
}
