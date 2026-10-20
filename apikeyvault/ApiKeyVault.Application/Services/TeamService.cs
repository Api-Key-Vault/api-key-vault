using ApiKeyVault.Application.Dtos.Team;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Domain.Entities;

namespace ApiKeyVault.Application.Services
{
	public class TeamService : ITeamService
	{
		private const string OwnerRoleName = "Owner";
		private readonly ITeamRepository _teamRepository;
		private readonly ITeamRoleRepository _teamRoleRepository;
		private readonly IApiKeyRepository _apiKeyRepository;
		private readonly ITeamInviteRepository _teamInviteRepository;

		public TeamService(ITeamRepository teamRepository, ITeamRoleRepository teamRoleRepository, IApiKeyRepository apiKeyRepository, ITeamInviteRepository teamInviteRepository)
		{
			_teamRepository = teamRepository;
			_teamRoleRepository = teamRoleRepository;
			_apiKeyRepository = apiKeyRepository;
			_teamInviteRepository = teamInviteRepository;
		}

		public async Task<GetTeamResponse?> GetByIdAsync(int teamId, string userId)
		{
			var team = await _teamRepository.GetTeamByIdAsync(teamId, userId);

			if (team is null)
			{
				return null;
			}

			var getTeamResponse = new GetTeamResponse
			{
				Id = team.Id,
				Name = team.Name,
				CreatedAt = team.CreatedAt
			};

			return getTeamResponse;
		}

		public async Task<List<GetTeamResponse>> GetAllTeamsAsync(string userId)
		{
			List<Team> teams = await _teamRepository.GetAllTeamsByUserIdAsync(userId);

			List<GetTeamResponse> responseList = teams.Select(team => new GetTeamResponse
			{
				Id = team.Id,
				Name = team.Name,
				CreatedAt = team.CreatedAt
			}).ToList();

			return responseList;
		}

		public async Task<TeamResponse?> CreateTeamAsync(CreateTeamRequest request, string userId)
		{

			// set team-role as owner here
			var ownerRole = await _teamRoleRepository.GetRoleByNameAsync(OwnerRoleName);

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
                CreatedAt = DateTime.UtcNow
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

		public async Task<bool> DeleteTeamAsync(int teamId, string userId)
		{
			var teamToDelete = await _teamRepository.GetTeamForDeletionAsync(teamId, userId);

			if (teamToDelete is null)
			{
				return false;
			}

			await _apiKeyRepository.RemoveByTeamAsync(teamId);
			await _teamInviteRepository.RemoveByTeamAsync(teamId);
			_teamRepository.DeleteTeam(teamToDelete);
			await _teamRepository.SaveChangesAsync();

			return true;
		}




		public async Task<TeamResponse?> UpdateTeam(UpdateTeamRequest updateTeamRequest, string userId)
		{
			var teamToUpdate = await _teamRepository.GetTeamByIdAsync(updateTeamRequest.Id, userId);

			if (teamToUpdate is null)
			{
				return null;
			}

			var owner = teamToUpdate.Members.SingleOrDefault(m => m.Role.Name == "Owner");
			if (owner == null || owner.UserId != userId)
			{
				return null;
			}

			teamToUpdate.Name = updateTeamRequest.Name;

			await _teamRepository.UpdateTeamAsync(teamToUpdate);
			await _teamRepository.SaveChangesAsync();

			var response = new TeamResponse
			{
				Id = updateTeamRequest.Id,
				Name = updateTeamRequest.Name
			};

			return response;
		}
    }
}
