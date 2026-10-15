using ApiKeyVault.Application.Dtos.ApiKeyAccess;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Domain.Entities;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests
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
    }
}
