using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
    public class ApiKeyAccessService : IApiKeyAccessService
    {
        private const string OwnerRoleName = "Owner";

        private readonly IApiKeyAccessRepository _apiKeyAccessRepository;
        private readonly ITeamMemberRepository _teamMemberRepository;
        private readonly IApiKeyRepository _apiKeyRepository;
        public ApiKeyAccessService(IApiKeyAccessRepository apiKeyAccessRepository, ITeamMemberRepository teamMemberRepository, IApiKeyRepository apiKeyRepository)
        {
            _apiKeyAccessRepository = apiKeyAccessRepository;
            _teamMemberRepository = teamMemberRepository;
            _apiKeyRepository = apiKeyRepository;
        }
        public async Task<ApiKeyAccessResponse?> CreateAsync(int teamId, string userId, GrantApiKeyAccessRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if(member is null || !IsOwner(member))
            {
                return null;
            }

            var targetMember = await _teamMemberRepository.GetByIdAsync(request.TeamMemberId);

            if(targetMember is null || targetMember.TeamId != teamId)
            {
                return null;
            }

            var apiKey = await _apiKeyRepository.GetByIdAsync(teamId, request.ApiKeyId);

            if(apiKey is null)
            {
                return null;
            }

            var exists = await _apiKeyAccessRepository.ExistsAsync(request.TeamMemberId, request.ApiKeyId);

            if (exists)
            {
                return null;
            }

            var apiKeyAccess = new ApiKeyAccess
            {
                ApiKeyId = request.ApiKeyId,
                TeamMemberId = request.TeamMemberId,
                GrantedByMemberId = member.Id
            };

            await _apiKeyAccessRepository.AddAsync(apiKeyAccess);
            await _apiKeyAccessRepository.SaveChangesAsync();

            return new ApiKeyAccessResponse
            {
                ApiKeyId = apiKeyAccess.ApiKeyId,
                TeamMemberId = apiKeyAccess.TeamMemberId,
                GrantedByMemberId = apiKeyAccess.GrantedByMemberId
            };
        }

        public async Task<bool> RevokeAsync(int teamId, string userId, int apiKeyId, int teamMemberId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if(member is null || !IsOwner(member))
            {
                return false;
            }

            var targetMember = await _teamMemberRepository.GetByIdAsync(teamMemberId);

            if(targetMember is null || targetMember.TeamId != teamId)
            {
                return false;
            }

            var apikey = await _apiKeyRepository.GetByIdAsync(teamId, apiKeyId);

            if(apikey is null)
            {
                return false;
            }

            bool deleted = await _apiKeyAccessRepository.RevokeAsync(teamMemberId, apiKeyId);

            if (!deleted)
            {
                return false;
            }

            await _apiKeyAccessRepository.SaveChangesAsync();

            return true; 
        }

        private static bool IsOwner(TeamMember member)
        {
            return string.Equals(member.Role.Name, OwnerRoleName, StringComparison.Ordinal);
        }
    }
}
