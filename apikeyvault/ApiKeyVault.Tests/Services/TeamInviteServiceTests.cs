using ApiKeyVault.Application.Dtos.TeamInvite;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Services;
using ApiKeyVault.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace ApiKeyVault.Tests.Services
{
    public class TeamInviteServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidOwner_ReturnsInviteUrlWithBase64UrlToken()
        {
            var owner = new TeamMember
            {
                Id = 1,
                TeamId = 1,
                UserId = "owner",
                Role = new TeamRole { Name = "Owner" }
            };            

            var memberRepository = new Mock<ITeamMemberRepository>();
            var inviteRepository = new Mock<ITeamInviteRepository>();
            var config = new Mock<IConfiguration>();
            var roleRepository = new Mock<ITeamRoleRepository>();

            memberRepository
                .Setup(repository => repository.GetByTeamAndUserAsync(1, "owner"))
                .ReturnsAsync(owner);
            config
                .Setup(config => config["Frontend:Origin"])
                .Returns("https://localhost:5173");

            var service = new TeamInviteService(memberRepository.Object, inviteRepository.Object, config.Object, roleRepository.Object);

            var result = await service.CreateAsync(1, "owner");

            Assert.NotNull(result);
            Assert.StartsWith("https://localhost:5173/invite?token=", result.InviteUrl);

            var token = result.InviteUrl.Split("token=")[1];
            Assert.Matches("^[A-Za-z0-9_-]{43}$", token);
        }

        [Fact]
        public async Task AcceptAsync_ExpiredInvite_ReturnsNull()
        {
            var invite = new TeamInvite
            {
                Id = 1,
                TeamId = 1,
                UsedByMemberId = null,
                ExpiresAt = DateTime.UtcNow.AddDays(-1), //Expired yesterday
                Team = new Team { Id = 1, Name = "Chaos" }
            };

            var inviteRepository = new Mock<ITeamInviteRepository>();
            var memberRepository = new Mock<ITeamMemberRepository>();
            var config = new Mock<IConfiguration>();
            var roleRepository = new Mock<ITeamRoleRepository>();

            inviteRepository
                .Setup(repository => repository.GetByTokenHashAsync(It.IsAny<string>()))
                .ReturnsAsync(invite);
            config
                .Setup(config => config["Frontend:Origin"])
                .Returns("https://localhost:5173");

            var service = new TeamInviteService(memberRepository.Object, inviteRepository.Object, config.Object, roleRepository.Object);

            var result = await service.AcceptAsync(new AcceptInviteRequest { Token = "token" }, "user");

            Assert.Null(result);

            memberRepository.Verify(repository => repository.AddAsync(It.IsAny<TeamMember>()), Times.Never);
            memberRepository.Verify(repository => repository.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task AcceptAsync_UsedInvite_ReturnsNull()
        {
            var invite = new TeamInvite
            {
                Id = 1,
                TeamId = 1,
                UsedByMemberId = 10, // Marks as used by user with memberId = 10
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                Team = new Team { Id = 1, Name = "Chaos" }
            };

            var inviteRepository = new Mock<ITeamInviteRepository>();
            var memberRepository = new Mock<ITeamMemberRepository>();
            var config = new Mock<IConfiguration>();
            var roleRepository = new Mock<ITeamRoleRepository>();

            inviteRepository
                .Setup(repository => repository.GetByTokenHashAsync(It.IsAny<string>()))
                .ReturnsAsync(invite);
            config
                .Setup(config => config["Frontend:Origin"])
                .Returns("https://localhost:5173");

            var service = new TeamInviteService(memberRepository.Object, inviteRepository.Object, config.Object, roleRepository.Object);

            var result = await service.AcceptAsync(new AcceptInviteRequest { Token = "token" }, "user");

            Assert.Null(result);

            memberRepository.Verify(repository => repository.AddAsync(It.IsAny<TeamMember>()), Times.Never);
            memberRepository.Verify(repository => repository.SaveChangesAsync(), Times.Never);
        }
    }
}