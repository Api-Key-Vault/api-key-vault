using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
    public class TeamService : ITeamService
    {

        private readonly ITeamRepository _teamRepository;
        private readonly ITeamRoleRepository _teamRoleRepository;
        private readonly ITeamMemberRepository _teamMemberRepository;

        public TeamService(ITeamRepository teamRepository, ITeamRoleRepository teamRoleRepository, ITeamMemberRepository teamMemberRepository)
        {
            _teamRepository = teamRepository;
            _teamRoleRepository = teamRoleRepository;
            _teamMemberRepository = teamMemberRepository;
        }

        public async Task<TeamResponse?> CreateTeamAsync(CreateTeamRequest request, string userId)
        {

            var newTeam = new Team
            {
                Name = request.Name,
                CreatedAt = DateTime.UtcNow  // set time here instead of inside the class
			};

            var tryAdd = await _teamRepository.AddTeamAsync(newTeam);

            if(tryAdd == false)
            {
                return null;
            }

            var response = new TeamResponse
            {
                Id = newTeam.Id,
                Name= newTeam.Name
            };

            // set team-role as owner here
            var ownerRole = await _teamRoleRepository.GetRoleByNameAsync("Owner");

			if (ownerRole is null)
			{
				throw new InvalidOperationException("The 'Owner' role does not exist.");
			}

			var setOwnerOfThisTeam = new TeamMember
            {
                TeamId = newTeam.Id,
                UserId = userId,
                RoleId = ownerRole.Id
            };

            await _teamMemberRepository.AddAsync(setOwnerOfThisTeam);
            await _teamMemberRepository.SaveChangesAsync();

            return response;
		}
    }
}
