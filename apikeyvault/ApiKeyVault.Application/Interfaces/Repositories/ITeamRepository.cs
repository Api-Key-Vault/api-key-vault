using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
		Task<Team?> GetTeamByIdAsync(int teamId, string userId);
		Task<Team?> GetTeamForDeletionAsync(int teamId, string userId);
		Task<List<Team>> GetAllTeamsByUserIdAsync(string userId);
		Task AddTeamAsync(Team teamToAdd);
		Task UpdateTeamAsync(Team teamToUpdate);
		void DeleteTeam(Team teamToDelete);
		Task SaveChangesAsync();

	}
}
