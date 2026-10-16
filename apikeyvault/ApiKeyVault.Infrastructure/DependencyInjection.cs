using ApiKeyVault.Application.Common.Options;
using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using ApiKeyVault.Infrastructure.Persistence;
using ApiKeyVault.Infrastructure.Persistence.Repositories;
using ApiKeyVault.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
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

            services.AddDataProtection().SetApplicationName("ApiKeyVault");

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

                    options.Events.OnAccessDenied = context => RedirectToFrontendLogin(context, LoginRedirectErrors.AccessDenied);
                    options.Events.OnRemoteFailure = context => RedirectToFrontendLogin(context, LoginRedirectErrors.LoginFailed);
                    
                });

            services.AddScoped<IGitHubAuthenticationService, GitHubAuthenticationService>();
            services.AddScoped<IApiKeyRepository, ApiKeyRepository>();
            services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();
            services.AddScoped<ITeamInviteRepository, TeamInviteRepository>();
            services.AddScoped<ITeamRoleRepository, TeamRoleRepository>();
            services.AddScoped<IApiKeyProtector, ApiKeyProtector>();
            services.AddScoped<IApiKeyAccessRepository, ApiKeyAccessRepository>();

            services.AddScoped<ITeamRepository, TeamRepository>();

            return services;
        }

        private static Task RedirectToFrontendLogin(HandleRequestContext<RemoteAuthenticationOptions> context, string errorCode)
        {
            var redirectService = context.HttpContext.RequestServices
                .GetRequiredService<IFrontendRedirectService>();
            string redirectUrl = redirectService
                .GetLoginUrl(errorCode);
            context.Response 
                .Redirect(redirectUrl);
            context.HandleResponse();

            return Task.CompletedTask;
        }
    }
}
