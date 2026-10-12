using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamMemberRepository
    {
        Task<TeamMember?> GetByTeamAndUserAsync(int teamId, string userId);
        Task AddAsync(TeamMember teamMember);
        Task RemoveAsync(TeamMember teamMember);
        Task SaveChangesAsync();
    }
}
