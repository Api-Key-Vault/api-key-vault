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

			// set team-role as owner here
			var ownerRole = await _teamRoleRepository.GetRoleByNameAsync("Owner");

			if (ownerRole is null)
			{
				throw new InvalidOperationException("The 'Owner' role does not exist.");
			}

			var setOwnerOfThisTeam = new TeamMember
			{
				UserId = userId,
				RoleId = ownerRole.Id
			};

			var newTeam = new Team
            {
                Name = request.Name,
                CreatedAt = DateTime.UtcNow  // set time here instead of inside the class
			};

			newTeam.Members.Add(setOwnerOfThisTeam);

			await _teamRepository.AddTeamAsync(newTeam);
			await _teamRepository.SaveChangesAsync();

			var response = new TeamResponse
			{
				Id = newTeam.Id,
				Name = newTeam.Name
			};

			return response;
		}
    }
}
