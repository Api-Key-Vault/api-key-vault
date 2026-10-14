using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiKeyVault.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/teams/{teamId:int}/access")]
    public class ApiKeyAccessController : ControllerBase
    {
        private readonly IApiKeyAccessService _apiKeyAccessService;
        public ApiKeyAccessController(IApiKeyAccessService apiKeyAccessService)
        {
            _apiKeyAccessService = apiKeyAccessService;
        }

        [HttpPost]
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

        [HttpDelete("{apiKeyId:int}/revoke")]
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
    }
}
