using ApiKeyVault.Application.Dtos.Team;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamService
    {
         Task<bool>CreateAsync( CreateTeamRequest request);

    }
}
