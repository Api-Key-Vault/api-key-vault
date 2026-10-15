using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
		Task<Team?> GetTeamByIdAsync(int teamId, string userId);
		Task<List<Team>> GetAllTeamsAsync(string userId);
		Task AddTeamAsync(Team teamToAdd);
        Task SaveChangesAsync();

	}
}
