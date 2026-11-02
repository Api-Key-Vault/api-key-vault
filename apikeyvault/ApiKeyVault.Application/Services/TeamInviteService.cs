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
        private readonly ITeamRoleRepository _teamRoleRepository;

        public TeamInviteService(ITeamMemberRepository teamMemberRepository, ITeamInviteRepository teamInviteRepository, IConfiguration configuration, ITeamRoleRepository teamRoleRepository)
        {
            _teamMemberRepository = teamMemberRepository;
            _teamInviteRepository = teamInviteRepository;
            _frontendOrigin = configuration["Frontend:Origin"]
                ?? throw new InvalidOperationException("Frontend:Origin configuration is required.");
            _teamRoleRepository = teamRoleRepository;
        }
        private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
        private static bool IsOwner(TeamMember member)
        {
            return string.Equals(member.Role.Name, OwnerRoleName, StringComparison.Ordinal);
        }

        public async Task<AcceptInviteResponse?> AcceptAsync(AcceptInviteRequest req, string userId)
        {
            var invite = await _teamInviteRepository.GetByTokenHashAsync(HashToken(req.Token));
            if (invite is null)
            {
                return null;
            }
            if (invite.UsedByMemberId is not null || invite.ExpiresAt <= DateTime.UtcNow)
            {
                return null;
            }

            var existing = await _teamMemberRepository.GetByTeamAndUserAsync(invite.TeamId, userId);
            if (existing is not null)
            {
                return null;
            }

            var memberRole = await _teamRoleRepository.GetRoleByNameAsync("Member");

            if (memberRole is null)
            {
                throw new InvalidOperationException("The 'Member' role does not exist.");
            }

            var member = new TeamMember
            {
                TeamId = invite.TeamId,
                UserId = userId,
                RoleId = memberRole.Id
            };

            await _teamMemberRepository.AddAsync(member);
            await _teamMemberRepository.SaveChangesAsync();

            var markSuccessful = await _teamInviteRepository.MarkInviteAsUsedAsync(invite.Id, member.Id);
            if (!markSuccessful)
            {
                await _teamMemberRepository.RemoveAsync(member);
                await _teamMemberRepository.SaveChangesAsync();
                return null;
            }

            return new AcceptInviteResponse
            {
                TeamId = invite.TeamId,
                TeamName = invite.Team.Name
            };
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

        public async Task<InvitePreviewResponse?> GetInvitePreviewAsync(string token)
        {
            var invite = await _teamInviteRepository.GetByTokenHashAsync(HashToken(token));

            if (invite is null)
            {
                return null;
            }

            if (invite.UsedByMemberId is not null || invite.ExpiresAt <= DateTime.UtcNow)
            {
                return null;
            }

            return new InvitePreviewResponse
            {
                TeamName = invite.Team.Name
            };
        }
    }
}