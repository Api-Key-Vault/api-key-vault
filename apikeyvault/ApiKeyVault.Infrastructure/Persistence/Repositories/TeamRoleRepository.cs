using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamRoleRepository : ITeamRoleRepository
    {
        public Task<TeamRole?> GetRoleByNameAsync(string name)
        {
            throw new NotImplementedException();
        }
    }
}