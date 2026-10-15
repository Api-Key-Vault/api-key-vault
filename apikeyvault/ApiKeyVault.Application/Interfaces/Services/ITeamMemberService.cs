using ApiKeyVault.Application.Dtos.TeamMember;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamMemberService
    {
        Task<List<TeamMemberResponse>> GetByTeamAsync(int teamId, string userId);
    }
}