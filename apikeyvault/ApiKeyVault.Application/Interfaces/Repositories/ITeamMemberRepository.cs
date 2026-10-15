using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamMemberRepository
    {
        Task<TeamMember?> GetByIdAsync(int teamMemberId);
        Task<TeamMember?> GetByTeamAndUserAsync(int teamId, string userId);
        Task<List<TeamMember>> GetByTeamAsync(int teamId);
        Task AddAsync(TeamMember teamMember);
        Task RemoveAsync(TeamMember teamMember);
        Task SaveChangesAsync();
    }
}
