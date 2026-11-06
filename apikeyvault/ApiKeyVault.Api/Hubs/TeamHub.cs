using System.Security.Claims;
using ApiKeyVault.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ApiKeyVault.Api.Hubs
{
    [Authorize]
    public class TeamHub : Hub
    {
        private readonly ITeamMemberService _memberService;

        public TeamHub(ITeamMemberService memberService)
        {
            _memberService = memberService;
        }

        public async Task JoinTeam(int teamId)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return;
            }

            var member = await _memberService.IsMemberAsync(teamId, userId);

            if (member is false)
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, $"team-{teamId}");
        }
    }
}