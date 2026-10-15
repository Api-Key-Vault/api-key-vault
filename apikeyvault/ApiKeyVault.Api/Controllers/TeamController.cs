using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [Route("api/teams")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }


        [HttpGet("{teamId:int}")]
        public async Task<ActionResult<GetTeamResponse>> GetTeamById([FromRoute]int teamId)
        {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (userId is null)
			{
				return Unauthorized();
			}

			var team = await _teamService.GetByIdAsync(teamId, userId);

			if (team is null)
			{
				return NotFound();
			}

			return Ok(team);
        }

        [HttpGet]
		public async Task<ActionResult<GetTeamResponse>> GetAllTeams()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId is null)
			{
				return Unauthorized();
			}

			var allTeams = await _teamService.GetAllTeamsAsync(userId);

			return Ok(allTeams);
		}


		[HttpPost]
		public async Task<ActionResult<TeamResponse>> CreateTeam([FromBody] CreateTeamRequest createTeamRequest)
        {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (userId is null)
			{
				return Unauthorized();
			}

			var newTeam = await _teamService.CreateTeamAsync(createTeamRequest, userId);

            if(newTeam is null)
            {
                return Forbid();
            }


			return StatusCode(StatusCodes.Status201Created, newTeam);
		}

    }
}
