using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Application.ReadModels;
using ApiKeyVault.Domain.Entities;
using ApiKeyVault.Application.Dtos.TeamMember;
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
            var teamRepository = new Mock<ITeamRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAsync(1))
                .ReturnsAsync(teamMembers);

            var service = new TeamMemberService(
                teamMemberRepository.Object,
                apiKeyAccessRepository.Object,
                teamInviteRepository.Object,
                teamRepository.Object,
                apiKeyRepository.Object
            );

            // Act
            var result = await service.GetByTeamAsync(1, "member");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, response => response.UserId == "owner" && response.RoleName == "Owner" && response.DisplayName == "Owner Name");
            Assert.Contains(result, response => response.UserId == "member" && response.RoleName == "Member" && response.DisplayName == "Member Name");
        }

        [Fact]
        public async Task RemoveAsync_UserIsNotOwner_ReturnsForbidden()
        {
            // Arrange
            var member = new TeamMember
            {
                Id = 2,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole {Name = "Member"}
            };
            
            var teamMemberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var teamInviteRepository = new Mock<ITeamInviteRepository>();
            var teamRepository = new Mock<ITeamRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            var service = new TeamMemberService(
                teamMemberRepository.Object,
                apiKeyAccessRepository.Object,
                teamInviteRepository.Object,
                teamRepository.Object,
                apiKeyRepository.Object
            );

            // Act
            var result = await service.RemoveAsync(1, "member", 3);

            // Assert
            Assert.Equal(TeamMemberResult.Forbidden, result);

            teamMemberRepository
                .Verify(repo => repo.RemoveAsync(It.IsAny<TeamMember>()), Times.Never);
        }

        [Fact]
        public async Task LeaveAsync_OwnerLeaves_DeletesTeamAndReturnSuccess()
        {
            // Arrange
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole {Name = "Owner"}
            };

            var team = new Team {Id = 1, Name = "TeamChaos"};

            var teamMemberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var teamInviteRepository = new Mock<ITeamInviteRepository>();
            var teamRepository = new Mock<ITeamRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);

            teamRepository
                .Setup(repo => repo.GetTeamForDeletionAsync(1, "owner"))
                .ReturnsAsync(team);

            teamMemberRepository
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            var service = new TeamMemberService(
                teamMemberRepository.Object,
                apiKeyAccessRepository.Object,
                teamInviteRepository.Object,
                teamRepository.Object,
                apiKeyRepository.Object
            );

            // Act
            var result = await service.LeaveAsync(1, "owner");

            // Assert
            Assert.Equal(TeamMemberResult.Success, result);

            teamRepository.Verify(repo => repo.DeleteTeam(team), Times.Once);
        }

        [Fact]
        public async Task LeaveAsync_MemberLeaves_DoesNotDeleteTeam()
        {
            // Arrange
            var member = new TeamMember
            {
                Id = 2,
                TeamId = 1,
                UserId = "member",
                Role = new TeamRole {Name = "member"}
            };

            var teamMemberRepository = new Mock<ITeamMemberRepository>();
            var apiKeyAccessRepository = new Mock<IApiKeyAccessRepository>();
            var teamInviteRepository = new Mock<ITeamInviteRepository>();
            var teamRepository = new Mock<ITeamRepository>();
            var apiKeyRepository = new Mock<IApiKeyRepository>();

            teamMemberRepository
                .Setup(repo => repo.GetByTeamAndUserAsync(1, "member"))
                .ReturnsAsync(member);

            apiKeyAccessRepository
                .Setup(repo => repo.GetByTeamMemberIdAsync(2))
                .ReturnsAsync(new List<ApiKeyAccess>());

            teamMemberRepository
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            var service = new TeamMemberService(
                teamMemberRepository.Object,
                apiKeyAccessRepository.Object,
                teamInviteRepository.Object,
                teamRepository.Object,
                apiKeyRepository.Object
            );

            // Act
            var result = await service.LeaveAsync(1, "member");

            // Assert 
            Assert.Equal(TeamMemberResult.Success, result);

            teamRepository.Verify(repo => repo.DeleteTeam(It.IsAny<Team>()), Times.Never);
        }
    }
}