using System.Security.Cryptography;
using System.Text;
using ApiKeyVault.Application.Dtos.TeamInvite;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace ApiKeyVault.Application.Services
{
    public class TeamInviteService : ITeamInviteService
    {
        private const string OwnerRoleName = "Owner";
        // Contract with frontend, invite-page must be read through this route and take query parameter "token".
        // This is not built yet in the frontend, so verify that they match when its built.
        private const string InviteRoute = "/invite?token={0}";
        private readonly string _frontendOrigin;
        private readonly ITeamMemberRepository _teamMemberRepository;
        private readonly ITeamInviteRepository _teamInviteRepository;

        public TeamInviteService(ITeamMemberRepository teamMemberRepository, ITeamInviteRepository teamInviteRepository, IConfiguration configuration)
        {
            _teamMemberRepository = teamMemberRepository;
            _teamInviteRepository = teamInviteRepository;
            _frontendOrigin = configuration["Frontend:Origin"]
                ?? throw new InvalidOperationException("Frontend:Origin configuration is required.");
        }
        private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
        private static bool IsOwner(TeamMember member)
        {
            return string.Equals(member.Role.Name, OwnerRoleName, StringComparison.Ordinal);
        }

        public Task<AcceptInviteResponse> AcceptAsync(AcceptInviteRequest req, string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<CreateTeamInviteResponse?> CreateAsync(int teamId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null || !IsOwner(member))
            {
                return null;
            }

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');

            var invite = new TeamInvite
            {
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                TokenHash = HashToken(token),
                TeamId = teamId,
                CreatedByMemberId = member.Id
            };

            await _teamInviteRepository.AddTeamInviteAsync(invite);
            await _teamInviteRepository.SaveChangesAsync();

            return new CreateTeamInviteResponse
            {
                InviteUrl = $"{_frontendOrigin}{string.Format(InviteRoute, token)}"
            };
        }
    }
}