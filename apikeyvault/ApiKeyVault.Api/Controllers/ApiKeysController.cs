using ApiKeyVault.Api.Hubs;
using ApiKeyVault.Application.Dtos.ApiKey;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/keys")]
    public class ApiKeysController : ControllerBase
    {
        private readonly IApiKeyService _apiKeyService;
        private readonly IHubContext<TeamHub> _hubContext;

        public ApiKeysController(IApiKeyService apiKeyService, IHubContext<TeamHub> hubContext)
        {
            _apiKeyService = apiKeyService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<ApiKeyResponse>>> GetByTeamAsync(int teamId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var apiKeys = await _apiKeyService.GetByTeamAsync(teamId, userId);

            return Ok(apiKeys);
        }

        [HttpGet("{apiKeyId:int}")]
        public async Task<ActionResult<ApiKeyResponse>> GetByIdAsync(int teamId, int apiKeyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var apiKey = await _apiKeyService.GetByIdAsync(teamId, apiKeyId, userId);

            if (apiKey is null)
            {
                return NotFound();
            }

            return Ok(apiKey);
        }

        [HttpPost]
        public async Task<ActionResult<ApiKeyResponse>> CreateAsync(int teamId, [FromBody] CreateApiKeyRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var apiKey = await _apiKeyService.CreateAsync(teamId, userId, request);

            if (apiKey is null)
            {
                return Forbid();
            }

            await _hubContext.Clients.Group($"team-{teamId}").SendAsync("ApiKeysChanged");

            return CreatedAtAction(nameof(GetByIdAsync), new { teamId, apiKeyId = apiKey.Id }, apiKey);
        }

        [HttpPatch("{apiKeyId:int}")]
        public async Task<ActionResult<ApiKeyResponse>> UpdateAsync(int teamId, int apiKeyId, [FromBody] UpdateApiKeyRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var apiKey = await _apiKeyService.UpdateAsync(teamId, apiKeyId, userId, request);

            if (apiKey is null)
            {
                return NotFound();
            }

            await _hubContext.Clients.Group($"team-{teamId}").SendAsync("ApiKeysChanged");

            return Ok(apiKey);
        }

        [HttpPost("{apiKeyId:int}/reveal")]
        public async Task<ActionResult<RevealApiKeyResponse>> RevealAsync(int teamId, int apiKeyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var apiKey = await _apiKeyService.RevealAsync(teamId, apiKeyId, userId);

            if (apiKey is null)
            {
                return NotFound();
            }

            return Ok(apiKey);
        }

        [HttpPost("{apiKeyId:int}/revoke")]
        public async Task<IActionResult> RevokeAsync(int teamId, int apiKeyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var revoked = await _apiKeyService.RevokeAsync(teamId, apiKeyId, userId);

            if (!revoked)
            {
                return NotFound();
            }

            await _hubContext.Clients.Group($"team-{teamId}").SendAsync("ApiKeysChanged");

            return NoContent();
        }

        [HttpDelete("{apiKeyId:int}")]
        public async Task<IActionResult> DeleteAsync(int teamId, int apiKeyId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }

            var deleted = await _apiKeyService.DeleteAsync(teamId, apiKeyId, userId);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
