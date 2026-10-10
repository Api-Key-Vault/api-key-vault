using ApiKeyVault.Application.Dtos.TeamInvite;
using ApiKeyVault.Application.Interfaces.Services;

namespace ApiKeyVault.Application.Services
{
    public class TeamInviteService : ITeamInviteService
    {
        public Task<AcceptInviteResponse> AcceptAsync(AcceptInviteRequest req, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<CreateTeamInviteResponse> CreateAsync(int teamId, string userId)
        {
            throw new NotImplementedException();
        }
    }
}