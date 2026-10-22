using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
		Task<Team?> GetTeamByIdAsync(int teamId, string userId);
		Task<Team?> GetTeamForDeletionAsync(int teamId, string userId);
		Task<List<TeamResponse>> GetAllTeamsByUserIdAsync(string userId);
		Task AddTeamAsync(Team teamToAdd);
		void DeleteTeam(Team teamToDelete);
		Task SaveChangesAsync();

	}
}
