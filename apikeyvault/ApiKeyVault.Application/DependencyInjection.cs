using System;
using System.Collections.Generic;
using System.Text;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace ApiKeyVault.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            
            return services;
        }
    }
}
