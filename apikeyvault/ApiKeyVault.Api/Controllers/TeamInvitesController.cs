using System.Security.Claims;
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var response = await _teamInviteService.CreateAsync(teamId, userId);

            if (response is null)
            {
                return Forbid();
            }

            return Ok(new CreateTeamInviteResponse { InviteUrl = response.InviteUrl });
        }

        [Route("/api/invites/accept")]
        [HttpPost]
        public async Task<ActionResult<AcceptInviteResponse>> AcceptInvite(AcceptInviteRequest req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var response = await _teamInviteService.AcceptAsync(req, userId);

            return response is null ? NotFound() : Ok(response);
        }
    }
}