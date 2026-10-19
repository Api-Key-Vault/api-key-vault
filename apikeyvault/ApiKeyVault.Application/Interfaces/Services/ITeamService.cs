using ApiKeyVault.Application.Dtos.Team;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamService
    {
        Task<GetTeamResponse?> GetByIdAsync(int teamId, string userId);
        Task<List<GetTeamResponse>> GetAllTeamsAsync(string userId);
        Task<TeamResponse?> CreateTeamAsync(CreateTeamRequest request, string userId);
        Task<bool> DeleteTeamAsync(int teamId, string userId);
    }
}
