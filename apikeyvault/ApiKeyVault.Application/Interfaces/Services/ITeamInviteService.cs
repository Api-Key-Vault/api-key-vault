using ApiKeyVault.Application.Dtos.TeamInvite;

namespace ApiKeyVault.Application.Interfaces.Services
{
    public interface ITeamInviteService
    {
        Task<CreateTeamInviteResponse?> CreateAsync(int teamId, string userId);
        Task<AcceptInviteResponse?> AcceptAsync(AcceptInviteRequest req, string userId);
        Task<InvitePreviewResponse?> GetInvitePreviewAsync(string token);
    }
}