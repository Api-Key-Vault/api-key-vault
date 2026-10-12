using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
    public class TeamService : ITeamService
    {

        private readonly ITeamRepository _teamRepository;

        public TeamService(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }

        public async Task<TeamResponse?> CreateTeamAsync(CreateTeamRequest request)
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
                Name= newTeam.Name,
                CreatedAt = newTeam.CreatedAt
            };

            return response;
		}
    }
}
