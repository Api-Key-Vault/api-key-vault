using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Infrastructure.Persistence.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly ApiKeyVaultDbContext _dbContext;

        public TeamRepository(ApiKeyVaultDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task AddTeamAsync(Team teamToAdd)
        {
            await _dbContext.Teams.AddAsync(teamToAdd);

		}
		public Task SaveChangesAsync()
		{
			return _dbContext.SaveChangesAsync();
		}

	}
}
