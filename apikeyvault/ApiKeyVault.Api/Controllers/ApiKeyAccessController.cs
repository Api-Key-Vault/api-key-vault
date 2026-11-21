using ApiKeyVault.Api.Hubs;
using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Application.ReadModels;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}")]
    public class ApiKeyAccessController : ControllerBase
    {
        private readonly IApiKeyAccessService _apiKeyAccessService;
        private readonly IHubContext<TeamHub> _hubcontext;

        public ApiKeyAccessController(IApiKeyAccessService apiKeyAccessService, IHubContext<TeamHub> hubContext)
        {
            _apiKeyAccessService = apiKeyAccessService;
            _hubcontext = hubContext;
        }

        [HttpPost("keys/accesses")]
        public async Task<ActionResult<ApiKeyAccessResponse>> CreateAsync(int teamId, [FromBody] GrantApiKeyAccessRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var result = await _apiKeyAccessService.CreateAsync(teamId, userId, request);

            if (result.Status == GrantAccessResult.Success)
            {
                await _hubcontext.Clients.Group($"team-{teamId}").SendAsync("ApiKeysChanged");
            }

            return result.Status switch
            {
                GrantAccessResult.Success
                    => Ok(result.Data),
                GrantAccessResult.Forbidden
                    => Forbid(),
                GrantAccessResult.NotFound
                    => NotFound(),
                GrantAccessResult.AlreadyExists
                    => Conflict(),
                GrantAccessResult.UnexpectedError
                    => StatusCode(500),
                _ => BadRequest()
            };
        }

        [HttpDelete("keys/{apiKeyId:int}/accesses/{teamMemberId:int}")]
        public async Task<IActionResult> RevokeAsync(int teamId, int apiKeyId, int teamMemberId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var revoked = await _apiKeyAccessService.RevokeAsync(teamId, userId, apiKeyId, teamMemberId);

            if (!revoked)
            {
                return BadRequest();
            }

            await _hubcontext.Clients.Group($"team-{teamId}").SendAsync("ApiKeysChanged");

            return NoContent();
        }

        [HttpGet("keys/{apiKeyId:int}/accesses")]
        public async Task<ActionResult<List<ApiKeyAccessResponse>>> GetByApiKeyAsync(int teamId, int apiKeyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var accesses = await _apiKeyAccessService.GetByApiKeyAsync(teamId, userId, apiKeyId);

            if (accesses is null)
            {
                return NotFound();
            }

            return Ok(accesses);
        }
    }
}
