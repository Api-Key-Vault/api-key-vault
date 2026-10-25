using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Application.ReadModels;
using ApiKeyVault.Domain.Entities;
using Xunit;
using Moq;

namespace ApiKeyVault.Tests
{
    public class TeamMemberServiceTests
    {
        [Fact]
        public async Task GetByTeamAsync_MemberOfTeam_ReturnAllMembers()
        {
            // Arrange
            var member = new TeamMember
            {
                Id = 2,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole {Name = "Member"}
            };

            var teamMembers = new List<TeamMemberReadModel>
            {
                new TeamMemberReadModel { Id = 1 , TeamId = 1, UserId = "owner", RoleName = "Owner", DisplayName = "Owner Name"},
                new TeamMemberReadModel { Id = 2, TeamId = 1, UserId = "member", RoleName = "Member", DisplayName = "Member Name"}
            };

            var teamMemberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var teamInviteRepository = new Mock<ITeamInviteRepository>();

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAsync(1))
                .ReturnsAsync(teamMembers);

            var service = new TeamMemberService(
                teamMemberRepository.Object,
                apiKeyAccessRepository.Object,
                teamInviteRepository.Object
            );

            // Act
            var result = await service.GetByTeamAsync(1, "member");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, response => response.UserId == "owner" && response.RoleName == "Owner" && response.DisplayName == "Owner Name");
            Assert.Contains(result, response => response.UserId == "member" && response.RoleName == "Member" && response.DisplayName == "Member Name");
        }
    }
}