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

        public async Task<bool> AddTeamAsync(Team teamToAdd)
        {
            await _dbContext.Teams.AddAsync(teamToAdd);
            var result = 0 < await _dbContext.SaveChangesAsync();

            return result;
		}


	}
}
