using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ApiKeyVault.Api.Hubs
{
    [Authorize]
    public class TeamHub : Hub
    {
    }
}
