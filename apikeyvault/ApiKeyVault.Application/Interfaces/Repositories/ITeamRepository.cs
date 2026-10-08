using ApiKeyVault.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
        Task CreateAsync(Team team);
    }
}
