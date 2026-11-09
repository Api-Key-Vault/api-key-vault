using System.Security.Claims;
using ApiKeyVault.Api.Hubs;
using ApiKeyVault.Application.Dtos.TeamMember;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/members")]
    public class TeamMembersController : ControllerBase
    {
        private readonly ITeamMemberService _teamMemberService;
        private readonly IHubContext<TeamHub> _hubContext;

        public TeamMembersController(ITeamMemberService teamMemberService, IHubContext<TeamHub> hubContext)
        {
            _teamMemberService = teamMemberService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<TeamMemberResponse>>> GetByTeamAsync(int teamId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var members = await _teamMemberService.GetByTeamAsync(teamId, userId);

            return Ok(members);
        }

        [HttpDelete("{teamMemberId:int}")]
        public async Task<IActionResult> RemoveAsync(int teamId, int teamMemberId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _teamMemberService.RemoveAsync(teamId, userId, teamMemberId);

            if (result == TeamMemberResult.Success)
            {
                await _hubContext.Clients.Group($"team-{teamId}").SendAsync("TeamMembersChanged");
                return NoContent();
            }

            return result switch
            {
                TeamMemberResult.Forbidden
                    => Forbid(),
                TeamMemberResult.NotFound
                    => NotFound(),
                TeamMemberResult.Failed
                    => Problem(),
                _ => BadRequest()
            };
        }

        [HttpDelete("me")]
        public async Task<IActionResult> LeaveAsync(int teamId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _teamMemberService.LeaveAsync(teamId, userId);

            if (result == TeamMemberResult.Success)
            {
                await _hubContext.Clients.Group($"team-{teamId}").SendAsync("TeamMembersChanged");
                return NoContent();
            }

            return result switch
            {
                TeamMemberResult.Forbidden
                    => Forbid(),
                TeamMemberResult.NotFound
                    => NotFound(),
                TeamMemberResult.Failed
                    => Problem(),
                _ => BadRequest()
            };
        }
    }
}