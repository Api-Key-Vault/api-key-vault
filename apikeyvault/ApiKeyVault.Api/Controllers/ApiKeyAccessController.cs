using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Application.ReadModels;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}")]
    public class ApiKeyAccessController : ControllerBase
    {
        private readonly IApiKeyAccessService _apiKeyAccessService;
        public ApiKeyAccessController(IApiKeyAccessService apiKeyAccessService)
        {
            _apiKeyAccessService = apiKeyAccessService;
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

            if (result is null)
            {
                return BadRequest();
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
