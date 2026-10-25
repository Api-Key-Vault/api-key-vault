using ApiKeyVault.Application.Dtos.ApiKey;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Domain.Entities;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests.Services
{
    public class ApiKeyServiceTests
    {
        [Fact]
        public async Task CreateAsync_EncryptsValue()
        {
            // Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };
            var memberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();
            var protector = new Mock<IApiKeyProtector>();
            ApiKey? savedApiKey = null;

            memberRepository
                .Setup(repository => repository.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            protector
                .Setup(apiKeyProtector => apiKeyProtector.Protect("plain-value"))
                .Returns("encrypted-value");
            apiKeyRepository
                .Setup(repository => repository.AddAsync(It.IsAny<ApiKey>()))
                .Callback<ApiKey>(apiKey => savedApiKey = apiKey)
                .Returns(Task.CompletedTask);
            apiKeyRepository
                .Setup(repository => repository.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            var service = new ApiKeyService(apiKeyRepository.Object, memberRepository.Object, protector.Object);

            // Act
            await service.CreateAsync(1, "owner", new CreateApiKeyRequest
            {
                Name = "Test key",
                Value = "plain-value"
            });

            // Assert
            Assert.NotNull(savedApiKey);
            Assert.Equal("encrypted-value", savedApiKey.EncryptedValue);
        }

        [Fact]
        public async Task RevealAsync_OwnerCanRevealKey()
        {
            // Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };
            var apiKey = new ApiKey
            {
                Id = 1,
                TeamId = 1,
                EncryptedValue = "encrypted-value"
            };
            var memberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();
            var protector = new Mock<IApiKeyProtector>();

            memberRepository
                .Setup(repository => repository.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            apiKeyRepository
                .Setup(repository => repository.GetByIdAsync(1, 1))
                .ReturnsAsync(apiKey);
            protector
                .Setup(apiKeyProtector => apiKeyProtector.Unprotect("encrypted-value"))
                .Returns("plain-value");

            var service = new ApiKeyService(apiKeyRepository.Object, memberRepository.Object, protector.Object);

            // Act
            var result = await service.RevealAsync(1, 1, "owner");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("plain-value", result.Value);
        }

        [Fact]
        public async Task RevealAsync_MemberCannotRevealUnassignedKey()
        {
            // Arrange
            var member = new TeamMember
            {
                Id = 2,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole { Name = "Member" }
            };
            var apiKey = new ApiKey
            {
                Id = 1,
                TeamId = 1,
                EncryptedValue = "encrypted-value"
            };
            var memberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();
            var protector = new Mock<IApiKeyProtector>();

            memberRepository
                .Setup(repository => repository.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);
            apiKeyRepository
                .Setup(repository => repository.GetByIdAsync(1, 1))
                .ReturnsAsync(apiKey);

            var service = new ApiKeyService(apiKeyRepository.Object, memberRepository.Object, protector.Object);

            // Act
            var result = await service.RevealAsync(1, 1, "member");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task RevealAsync_CannotRevealExpiredKey()
        {
            // Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };
            var apiKey = new ApiKey
            {
                Id = 1,
                TeamId = 1,
                EncryptedValue = "encrypted-value",
                ExpiresAt = DateTime.UtcNow.AddMinutes(-1)
            };
            var memberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();
            var protector = new Mock<IApiKeyProtector>();

            memberRepository
                .Setup(repository => repository.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            apiKeyRepository
                .Setup(repository => repository.GetByIdAsync(1, 1))
                .ReturnsAsync(apiKey);

            var service = new ApiKeyService(apiKeyRepository.Object, memberRepository.Object, protector.Object);

            // Act
            var result = await service.RevealAsync(1, 1, "owner");

            // Assert
            Assert.Null(result);
        }
    }
}
