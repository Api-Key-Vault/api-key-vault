using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
		Task<Team?> GetTeamByIdAsync(int teamId);
		Task<List<Team>> GetAllTeamsAsync();
		Task AddTeamAsync(Team teamToAdd);
        Task SaveChangesAsync();

	}
}
