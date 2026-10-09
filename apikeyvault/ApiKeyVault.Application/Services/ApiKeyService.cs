using ApiKeyVault.Application.Dtos.ApiKey;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;
using System.Security.Cryptography;

namespace ApiKeyVault.Application.Services
{
    public class ApiKeyService : IApiKeyService
    {
        private const string OwnerRoleName = "Owner";

        private readonly IApiKeyRepository _apiKeyRepository;
        private readonly ITeamMemberRepository _teamMemberRepository;
        private readonly IApiKeyProtector _apiKeyProtector;

        public ApiKeyService(IApiKeyRepository apiKeyRepository, ITeamMemberRepository teamMemberRepository, IApiKeyProtector apiKeyProtector)
        {
            _apiKeyRepository = apiKeyRepository;
            _teamMemberRepository = teamMemberRepository;
            _apiKeyProtector = apiKeyProtector;
        }

        public async Task<List<ApiKeyResponse>> GetByTeamAsync(int teamId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null)
            {
                return new List<ApiKeyResponse>();
            }

            var apiKeys = await _apiKeyRepository.GetByTeamAsync(teamId);

            return apiKeys
                .Where(apiKey => CanAccess(apiKey, member))
                .Select(apiKey => ToResponse(apiKey))
                .ToList();
        }

        public async Task<ApiKeyResponse?> GetByIdAsync(int teamId, int apiKeyId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null)
            {
                return null;
            }

            var apiKey = await _apiKeyRepository.GetByIdAsync(teamId, apiKeyId);

            if (apiKey is null || !CanAccess(apiKey, member))
            {
                return null;
            }

            return ToResponse(apiKey);
        }

        public async Task<ApiKeyResponse?> CreateAsync(int teamId, string userId, CreateApiKeyRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null || !IsOwner(member))
            {
                return null;
            }

            var apiKey = new ApiKey
            {
                TeamId = teamId,
                CreatedByMemberId = member.Id,
                Name = request.Name,
                EncryptedValue = _apiKeyProtector.Protect(request.Value),
                Category = request.Category,
                ExpiresAt = request.ExpiresAt
            };

            await _apiKeyRepository.AddAsync(apiKey);
            await _apiKeyRepository.SaveChangesAsync();

            return ToResponse(apiKey);
        }

        public async Task<ApiKeyResponse?> UpdateAsync(int teamId, int apiKeyId, string userId, UpdateApiKeyRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null || !IsOwner(member))
            {
                return null;
            }

            var apiKey = await _apiKeyRepository.GetByIdAsync(teamId, apiKeyId);

            if (apiKey is null)
            {
                return null;
            }

            apiKey.Name = request.Name;
            apiKey.Category = request.Category;
            apiKey.ExpiresAt = request.ExpiresAt;

            if (request.Value is not null)
            {
                apiKey.EncryptedValue = _apiKeyProtector.Protect(request.Value);
            }

            _apiKeyRepository.Update(apiKey);
            await _apiKeyRepository.SaveChangesAsync();

            return ToResponse(apiKey);
        }

        public async Task<RevealApiKeyResponse?> RevealAsync(int teamId, int apiKeyId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null)
            {
                return null;
            }

            var apiKey = await _apiKeyRepository.GetByIdAsync(teamId, apiKeyId);

            if (apiKey is null || !CanAccess(apiKey, member) || GetStatus(apiKey) != ApiKeyStatus.Active)
            {
                return null;
            }

            try
            {
                return new RevealApiKeyResponse
                {
                    Id = apiKey.Id,
                    Value = _apiKeyProtector.Unprotect(apiKey.EncryptedValue)
                };
            }
            catch (CryptographicException)
            {
                return null;
            }
        }

        public async Task<bool> RevokeAsync(int teamId, int apiKeyId, string userId)
        {
            var member = await _teamMemberRepository.GetByTeamAndUserAsync(teamId, userId);

            if (member is null || !IsOwner(member))
            {
                return false;
            }

            var apiKey = await _apiKeyRepository.GetByIdAsync(teamId, apiKeyId);

            if (apiKey is null)
            {
                return false;
            }

            if (apiKey.RevokedAt is null)
            {
                apiKey.RevokedAt = DateTime.UtcNow;
                _apiKeyRepository.Update(apiKey);
                await _apiKeyRepository.SaveChangesAsync();
            }

            return true;
        }

        private static bool CanAccess(ApiKey apiKey, TeamMember member)
        {
            return apiKey.TeamId == member.TeamId &&
                (IsOwner(member) || apiKey.ApiKeyAccesses.Any(access => access.TeamMemberId == member.Id));
        }

        private static bool IsOwner(TeamMember member)
        {
            return string.Equals(member.Role.Name, OwnerRoleName, StringComparison.Ordinal);
        }

        private static ApiKeyResponse ToResponse(ApiKey apiKey)
        {
            return new ApiKeyResponse
            {
                Id = apiKey.Id,
                Name = apiKey.Name,
                Category = apiKey.Category,
                CreatedAt = apiKey.CreatedAt,
                ExpiresAt = apiKey.ExpiresAt,
                RevokedAt = apiKey.RevokedAt,
                Status = GetStatus(apiKey)
            };
        }

        private static ApiKeyStatus GetStatus(ApiKey apiKey)
        {
            if (apiKey.RevokedAt is not null)
            {
                return ApiKeyStatus.Revoked;
            }

            if (apiKey.ExpiresAt is not null && apiKey.ExpiresAt <= DateTime.UtcNow)
            {
                return ApiKeyStatus.Expired;
            }

            return ApiKeyStatus.Active;
        }
    }
}
