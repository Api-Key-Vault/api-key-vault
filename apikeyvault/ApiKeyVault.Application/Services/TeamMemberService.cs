using System.Runtime.CompilerServices;
using ApiKeyVault.Application.Dtos.TeamMember;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
    public class TeamMemberService : ITeamMemberService
    {
        private readonly ITeamMemberRepository _teamMemberRepository;

        public TeamMemberService(ITeamMemberRepository teamMemberRepository)
        {
            _teamMemberRepository = teamMemberRepository;
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
    }
}