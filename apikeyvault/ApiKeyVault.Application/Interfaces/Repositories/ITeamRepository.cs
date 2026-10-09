using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
        Task <Team>AddTeamAsync(Team team);
    }
}
