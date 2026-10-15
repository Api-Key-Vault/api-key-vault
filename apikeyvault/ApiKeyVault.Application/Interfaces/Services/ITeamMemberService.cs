using ApiKeyVault.Application.Dtos.TeamMember;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamMemberService
    {
        Task<List<TeamMemberResponse>> GetByTeamAsync(int teamId, string userId);
        Task<TeamMemberResult> RemoveAsync(int id, string userId, int teamMemberId);
        Task<TeamMemberResult> LeaveAsync(int teamId, string userId);
    }
}