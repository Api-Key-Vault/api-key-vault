using ApiKeyVault.Infrastructure.Identity;
using ApiKeyVault.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace ApiKeyVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApiKeyVaultDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApiKeyVaultDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication()
                .AddGitHub(options =>
                {
                    options.ClientId = configuration["Authentication:GitHub:ClientId"];
                    options.ClientSecret = configuration["Authentication:GitHub:ClientSecret"];
                    options.Scope.Add("user:email");                   
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "login");                    
                });                    

            return services;
        }

    }
}
