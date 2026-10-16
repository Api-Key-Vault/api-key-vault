using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
		Task<Team?> GetTeamByIdAsync(int teamId, string userId);
		Task<List<Team>> GetAllTeamsByUserIdAsync(string userId);
		Task AddTeamAsync(Team teamToAdd);
		Task DeleteTeamAsync(Team teamToDelete);

		Task SaveChangesAsync();

	}
}
