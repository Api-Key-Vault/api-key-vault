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

		public async Task<TeamResponse?> GetByIdAsync(int teamId, string userId)
		{
			var team = await _teamRepository.GetTeamByIdAsync(teamId, userId);

			if (team is null)
			{
				return null;
			}

			var teamMember = team.Members.FirstOrDefault(m => m.UserId == userId);

			if (teamMember is null)
			{
				return null;
			}

			var ownerRole = await _teamRoleRepository.GetRoleByNameAsync(OwnerRoleName);

			if (ownerRole is null)
			{
				throw new InvalidOperationException("The 'Owner' role does not exist.");
			}

			int keys = teamMember.Role.Name == ownerRole.Name
				? team.ApiKeys.Count
				: team.ApiKeys.Count(ak => ak.ApiKeyAccesses.Any(a => a.TeamMemberId == teamMember.Id));

			return new TeamResponse
			{
				Id = team.Id,
				Name = team.Name,
				Members = team.Members.Count,
				Keys = keys
			};
		}

		public async Task<List<TeamResponse>> GetAllTeamsAsync(string userId)
		{
			return await _teamRepository.GetAllTeamsByUserIdAsync(userId);
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
	}
}
