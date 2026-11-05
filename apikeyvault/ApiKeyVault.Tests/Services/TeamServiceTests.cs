using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Domain.Entities;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests.Services
{
	public class TeamServiceTests
	{
		[Fact]
		public async Task CreateTeamAsync_ValidRequest_ReturnsTeamResponse()
		{
			// Arrange
			var request = new CreateTeamRequest
			{
				Name = "Test Team"
			};

			var ownerRole = new TeamRole
			{
				Id = 1,
				Name = "Owner"
			};

			var teamRepository = new Mock<ITeamRepository>();
			var teamRoleRepository = new Mock<ITeamRoleRepository>();
			var apiKeyRepository = new Mock<IApiKeyRepository>();
			var teamInviteRepository = new Mock<ITeamInviteRepository>();

			teamRoleRepository
				.Setup(repo => repo.GetRoleByNameAsync("Owner"))
				.ReturnsAsync(ownerRole);

			var service = new TeamService(
				teamRepository.Object,
				teamRoleRepository.Object,
				apiKeyRepository.Object,
				teamInviteRepository.Object);

			// Act
			var result = await service.CreateTeamAsync(request, "user123");

			// Assert
			Assert.NotNull(result);
			Assert.Equal("Test Team", result.Name);

			teamRepository.Verify(
				repo => repo.AddTeamAsync(It.Is<Team>(
					team => team.Name == "Test Team" &&
							team.Members.Any(m =>
								m.UserId == "user123" &&
								m.RoleId == ownerRole.Id))),
				Times.Once);

			teamRepository.Verify(
				repo => repo.SaveChangesAsync(),
				Times.Once);
		}

		[Fact]
		public async Task DeleteTeamAsync_TeamDoesNotExist_ReturnsFalse()
		{
			// Arrange
			var teamRepository = new Mock<ITeamRepository>();
			var teamRoleRepository = new Mock<ITeamRoleRepository>();
			var apiKeyRepository = new Mock<IApiKeyRepository>();
			var teamInviteRepository = new Mock<ITeamInviteRepository>();

			teamRepository
				.Setup(repo => repo.GetTeamForDeletionAsync(1, "user123"))
				.ReturnsAsync((Team?)null);

			var service = new TeamService(
				teamRepository.Object,
				teamRoleRepository.Object,
				apiKeyRepository.Object,
				teamInviteRepository.Object);

			// Act
			var result = await service.DeleteTeamAsync(1, "user123");

			// Assert
			Assert.False(result);

			apiKeyRepository.Verify(
				repo => repo.RemoveByTeamAsync(It.IsAny<int>()),
				Times.Never);

			teamInviteRepository.Verify(
				repo => repo.RemoveByTeamAsync(It.IsAny<int>()),
				Times.Never);

			teamRepository.Verify(
				repo => repo.SaveChangesAsync(),
				Times.Never);
		}
	}
}