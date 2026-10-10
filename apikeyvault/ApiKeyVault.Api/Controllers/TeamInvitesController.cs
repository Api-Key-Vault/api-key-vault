using ApiKeyVault.Application.Dtos.TeamInvite;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/invites")]
    public class TeamInvitesController : ControllerBase
    {
        private readonly ITeamInviteService _teamInviteService;
        
        public TeamInvitesController(ITeamInviteService teamInviteService)
        {
            _teamInviteService = teamInviteService;
        }

        [HttpPost]
        public async Task<ActionResult<CreateTeamInviteResponse>> CreateInvite(int teamId)
        {
            throw new NotImplementedException();
        }

        [Route("/api/invites/accept")]
        [HttpPost]
        public async Task<ActionResult<AcceptInviteResponse>> AcceptInvite(AcceptInviteRequest req)
        {
            throw new NotImplementedException();
        }
    }
}