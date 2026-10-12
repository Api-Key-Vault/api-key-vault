using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRoleRepository
    {
        // Please add any methods needed in your services here:
        Task<TeamRole?> GetRoleByNameAsync(string name);
    }
}