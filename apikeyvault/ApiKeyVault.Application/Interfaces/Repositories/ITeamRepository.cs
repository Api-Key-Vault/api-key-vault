using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
        Task AddTeamAsync(Team teamToAdd);
        Task SaveChangesAsync();

	}
}
