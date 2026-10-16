using System.Security.Claims;
using ApiKeyVault.Application.Dtos.TeamMember;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/members")]
    public class TeamMembersController : ControllerBase
    {
        private readonly ITeamMemberService _teamMemberService;

        public TeamMembersController(ITeamMemberService teamMemberService)
        {
            _teamMemberService = teamMemberService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TeamMemberResponse>>> GetByTeamAsync(int teamId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId is null)
            {
                return Unauthorized();
            }

            var members = await _teamMemberService.GetByTeamAsync(teamId, userId);

            return Ok(members);
        }
    }
}