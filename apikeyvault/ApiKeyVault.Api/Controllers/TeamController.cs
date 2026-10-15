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


		// this one is only dumb and temp to be able to do "Created at" will do proper one soon!
		[HttpGet("{id:int}")]
		public IActionResult GetById(int id)
		{
			return Ok();
		}



		[HttpPost]
		public async Task<ActionResult<TeamResponse>> CreateTeam([FromBody] CreateTeamRequest createTeamRequest)
        {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (userId is null)
			{
				return Unauthorized();
			}

			var newTeam = await _teamService.CreateTeamAsync(createTeamRequest);

            if(newTeam is null)
            {
                return Forbid();
            }

			// TODO implementation of add role "owner" to this userId here when role exist

			return CreatedAtAction(nameof(GetById), new { id = newTeam.Id },newTeam);
		}

    }
}
