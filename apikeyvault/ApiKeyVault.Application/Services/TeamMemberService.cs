using ApiKeyVault.Application.Dtos.TeamMember;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
    public class TeamMemberService : ITeamMemberService
    {
        private const string OwnerRoleName = "Owner";
        private readonly ITeamMemberRepository _teamMemberRepository;
        private readonly IApiKeyAccessRepository _apiKeyAccessRepository;

        public TeamMemberService(ITeamMemberRepository teamMemberRepository, IApiKeyAccessRepository apiKeyAccessRepository)
        {
            _teamMemberRepository = teamMemberRepository;
            _apiKeyAccessRepository = apiKeyAccessRepository;
        }

        public async Task<List<TeamMemberResponse>> GetByTeamAsync(int teamId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if(member is null)
            {
                return new List<TeamMemberResponse>();
            }

            var members = await _teamMemberRepository.GetByTeamAsync(teamId);

            var memberDtos = members
                .Select(teamMember => new TeamMemberResponse
                {
                    Id = teamMember.Id,
                    UserId = teamMember.UserId,
                    TeamId = teamMember.TeamId,
                    RoleName = teamMember.Role.Name  
                })
                .ToList();

            return memberDtos;
        }
        
        public async Task<TeamMemberResult> RemoveAsync(int teamId, string userId, int teamMemberId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null || !IsOwner(member))
            {
                return TeamMemberResult.Forbidden;
            }

            var targetMember = await _teamMemberRepository.GetByIdAsync(teamMemberId);

            if(targetMember is null || targetMember.TeamId != teamId)
            {
                return TeamMemberResult.NotFound;
            }

            if(IsOwner(targetMember))
            {
                return TeamMemberResult.Forbidden;
            }

            // Remove the Apikey access for the target member before removing the member itself
            var apiKeyAccesses = await _apiKeyAccessRepository.GetByTeamMemberIdAsync(targetMember.Id);

            if(apiKeyAccesses.Count > 0)
            {
                foreach(var access in apiKeyAccesses)
                {
                    await _apiKeyAccessRepository.RevokeAsync(access.TeamMemberId, access.ApiKeyId);
                }
            }

            await _teamMemberRepository.RemoveAsync(targetMember);
            var result = await _teamMemberRepository.SaveChangesAsync();

            if(result <= 0)
            {
                return TeamMemberResult.Failed;
            }

            return TeamMemberResult.Success;
        }
        // Checks if the member has the Owner role
        private static bool IsOwner(TeamMember member)
        {
            return string.Equals(member.Role.Name, OwnerRoleName, StringComparison.Ordinal);
        }

        public async Task<TeamMemberResult> LeaveAsync(int teamId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if(member is null)
            {
                return TeamMemberResult.NotFound;
            }

            if(IsOwner(member))
            {
                return TeamMemberResult.Forbidden;
            }

            // Remove the Apikey access for the member before removing the member itself.
            var apiKeyAccesses = await _apiKeyAccessRepository.GetByTeamMemberIdAsync(member.Id);

            if(apiKeyAccesses.Count > 0)
            {
                foreach (var access in apiKeyAccesses)
                {
                    await _apiKeyAccessRepository.RevokeAsync(access.TeamMemberId, access.ApiKeyId);
                }
            }

            await _teamMemberRepository.RemoveAsync(member);
            var result = await _teamMemberRepository.SaveChangesAsync();

            if(result <= 0)
            {
                return TeamMemberResult.Failed;
            }

            return TeamMemberResult.Success;
        }
    }
}