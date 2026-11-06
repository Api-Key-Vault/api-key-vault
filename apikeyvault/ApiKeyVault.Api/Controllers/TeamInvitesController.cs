using System.Security.Claims;
using ApiKeyVault.Api.Hubs;
using ApiKeyVault.Application.Dtos.TeamInvite;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/invites")]
    public class TeamInvitesController : ControllerBase
    {
        private readonly ITeamInviteService _teamInviteService;
        private readonly IHubContext<TeamHub> _hubContext;

        public TeamInvitesController(ITeamInviteService teamInviteService, IHubContext<TeamHub> hubContext)
        {
            _teamInviteService = teamInviteService;
            _hubContext = hubContext;
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

            if (response is null)
            {
                return NotFound();
            }

            await _hubContext.Clients.Group($"team-{response.TeamId}").SendAsync("TeamMembersChanged");

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("/api/invites/preview")]
        public async Task<ActionResult<InvitePreviewResponse>> GetInvitePreview([FromQuery] string token)
        {
            var response = await _teamInviteService.GetInvitePreviewAsync(token);

            if (response is null)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}