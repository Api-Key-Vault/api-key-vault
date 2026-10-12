using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRoleRepository
    {
        Task<TeamRole?> GetRoleByNameAsync(string name);
    }
}