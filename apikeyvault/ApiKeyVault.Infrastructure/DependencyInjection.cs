using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using ApiKeyVault.Infrastructure.Persistence;
using ApiKeyVault.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
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

            var githubClientId = configuration["Authentication:GitHub:ClientId"];
            var githubClientSecret = configuration["Authentication:GitHub:ClientSecret"];

            if (string.IsNullOrWhiteSpace(githubClientId))
            {
                throw new InvalidOperationException("GitHub OAuth client ID is not configured.");
            }

            if (string.IsNullOrWhiteSpace(githubClientSecret))
            {
                throw new InvalidOperationException("GitHub OAuth client secret is not configured.");
            }

            services.AddAuthentication()
                .AddGitHub(options =>
                {
                    options.ClientId = githubClientId;
                    options.ClientSecret = githubClientSecret;
                    options.Scope.Add("user:email");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "login");
                    options.Events.OnRemoteFailure = context =>
                    {
                        context.Response.Redirect("/api/auth/github/callback?error=external_login_failed");
                        context.HandleResponse();
                        
                        return Task.CompletedTask;
                    };
                });

            services.AddScoped<IGitHubAuthenticationService, GitHubAuthenticationService>();

            return services;
        }

    }
}
