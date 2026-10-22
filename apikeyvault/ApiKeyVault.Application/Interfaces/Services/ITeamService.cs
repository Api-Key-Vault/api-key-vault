using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamService
    {
         Task<TeamResponse?> GetByIdAsync(int teamId, string userId);
         Task<List<TeamResponse>> GetAllTeamsAsync(string userId);
		 Task<TeamResponse?>CreateTeamAsync( CreateTeamRequest request, string userId);
         Task<TeamResponse?> UpdateTeam(UpdateTeamRequest updateTeamRequest, string userId, int teamId);
		 Task<bool> DeleteTeamAsync(int teamId, string userId);

	}
}
