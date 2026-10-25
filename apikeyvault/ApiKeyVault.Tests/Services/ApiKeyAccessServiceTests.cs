using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Domain.Entities;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests.Services
{
    public class ApiKeyAccessServiceTests
    {
        [Fact]
        public async Task CreateAsync_MemberIsNotOwner_ReturnForbidden()
        {
            //Arrange 
            var member = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole { Name = "Member" }
            };

            var grantApiKeyAccess = new GrantApiKeyAccessRequest
            {
                ApiKeyId = 1,
                TeamMemberId = member.Id
            };

            var membersRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            membersRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            var service = new ApiKeyAccessService(apiKeyAccessRepository.Object, membersRepository.Object, apiKeyRepository.Object);

            //Act
            var result = await service.CreateAsync(1, "member", grantApiKeyAccess);

            //Assert 
            Assert.NotNull(result);
            Assert.Equal(GrantAccessResult.Forbidden, result.Status);
        }

        [Fact]
        public async Task CreateAsync_OwnerGrantsAccessToSelf_ReturnsAlreadyExists()
        {
            //Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };

            var grantApiKeyAccess = new GrantApiKeyAccessRequest
            {
                ApiKeyId = 1,
                TeamMemberId = owner.Id
            };

            var apiKey = new ApiKey
            {
                Id = 1,
                TeamId = 1
            };

            var membersRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            membersRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            membersRepository.Setup(repo => repo.GetByIdAsync(owner.Id))
                .ReturnsAsync(owner);
            apiKeyRepository
                .Setup(repo => repo.GetByIdAsync(owner.TeamId, apiKey.Id))
                .ReturnsAsync(apiKey);

            var service = new ApiKeyAccessService(apiKeyAccessRepository.Object, membersRepository.Object, apiKeyRepository.Object);

            //Act
            var result = await service.CreateAsync(1, "owner", grantApiKeyAccess);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(GrantAccessResult.AlreadyExists, result.Status);
        }

        [Fact]
        public async Task CreateAsync_CrossTeamAccess_ReturnsNotFound()
        {
            //Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };

            var member = new TeamMember
            {
                Id = 2,
                TeamId = 2,
                UserId = "member",
                Role = new TeamRole { Name = "Member" }
            };

            var grantApiKeyAccess = new GrantApiKeyAccessRequest
            {
                ApiKeyId = 1,
                TeamMemberId = member.Id
            };

            var membersRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            membersRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            membersRepository
                .Setup(repo => repo.GetByIdAsync(member.Id))
                .ReturnsAsync(member);

            var service = new ApiKeyAccessService(apiKeyAccessRepository.Object, membersRepository.Object, apiKeyRepository.Object);

            //Act
            var result = await service.CreateAsync(1, "owner", grantApiKeyAccess);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(GrantAccessResult.NotFound, result.Status);

            apiKeyAccessRepository
               .Verify(repo => repo.AddAsync(It.IsAny<ApiKeyAccess>()), Times.Never);
        }

        [Fact]
        public async Task RevokeAsync_MemberIsNotOwner_ReturnsFalse()
        {
            //Arrange
            var member = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole { Name = "Member" }
            };

            var membersRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            membersRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            var service = new ApiKeyAccessService(apiKeyAccessRepository.Object, membersRepository.Object, apiKeyRepository.Object);

            //Act
            var result = await service.RevokeAsync(1, "member", 1, member.Id);

            //Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetByApiKeyAsync_CrossTeamAccess_ReturnsNull()
        {
            //Arrange
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
                TeamId = 2
            };

            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var membersRepository = new Mock<ITeamMemberRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            membersRepository.Setup(repo => 
                repo.GetByTeamAndUserAsync(owner.TeamId, owner.UserId))
                .ReturnsAsync(owner);
         
            apiKeyRepository.Setup(repo => 
                repo.GetByIdAsync(owner.TeamId, apiKey.Id))
                .ReturnsAsync((ApiKey?)null);

            var apiKeyService = new ApiKeyAccessService(
                apiKeyAccessRepository.Object, 
                membersRepository.Object, 
                apiKeyRepository.Object
                );

            //Act
            var result = await apiKeyService.GetByApiKeyAsync(owner.TeamId, owner.UserId, apiKey.Id);

            //Assert
            Assert.Null(result);
        }
    }
}
