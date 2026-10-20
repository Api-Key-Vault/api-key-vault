using ApiKeyVault.Application.Dtos.Team;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamService
    {
        Task<TeamResponse?> GetByIdAsync(int teamId, string userId);
        Task<List<TeamResponse>> GetAllTeamsAsync(string userId);
        Task<TeamResponse?> CreateTeamAsync(CreateTeamRequest request, string userId);
        Task<bool> DeleteTeamAsync(int teamId, string userId);
    }
}
