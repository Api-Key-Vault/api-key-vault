using ApiKeyVault.Application.Constants;
using ApiKeyVault.Application.Interfaces.Repositories;
using ApiKeyVault.Application.Interfaces.Services;
using ApiKeyVault.Infrastructure.Identity;
using ApiKeyVault.Infrastructure.Persistence;
using ApiKeyVault.Infrastructure.Persistence.Repositories;
using ApiKeyVault.Infrastructure.Services;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Runtime.CompilerServices;
using System.Security.Claims;

[assembly: InternalsVisibleTo("ApiKeyVault.Tests")]
namespace ApiKeyVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
        {
            services.AddDbContext<ApiKeyVaultDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            var dataProtectionBuilder = services.AddDataProtection().SetApplicationName("ApiKeyVault");

            var blobUri = configuration["DataProtection:BlobUri"];
            var keyUri = configuration["DataProtection:KeyVaultKeyUri"];

            // Values for blobUri and keyUri are empty by default in local development appsettings.json,
            // This is default and expected behavior, and this if statement will only be run in production
            // with Azure env variables.
            if (!environment.IsDevelopment() &&
                (string.IsNullOrEmpty(blobUri) || string.IsNullOrEmpty(keyUri)))
            {
                throw new InvalidOperationException(
                    "Azure Data Protection is not configured. " +
                    "Set DataProtection:BlobUri and DataProtection:KeyVaultKeyUri " +
                    $"(environment: {environment.EnvironmentName}).");
            }

            if (!string.IsNullOrEmpty(blobUri) && !string.IsNullOrEmpty(keyUri))
            {
                var credential = new DefaultAzureCredential();
                dataProtectionBuilder
                    .PersistKeysToAzureBlobStorage(new Uri(blobUri), credential)
                    .ProtectKeysWithAzureKeyVault(new Uri(keyUri), credential);
            }

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

                    options.Events.OnAccessDenied = context =>
                    {
                        RedirectToFrontendLogin(context.Response, context.HttpContext.RequestServices, LoginRedirectErrors.AccessDenied);
                        context.HandleResponse();
                        return Task.CompletedTask;
                    };
                    options.Events.OnRemoteFailure = context =>
                    {
                        RedirectToFrontendLogin(context.Response, context.HttpContext.RequestServices, LoginRedirectErrors.LoginFailed);
                        context.HandleResponse();
                        return Task.CompletedTask;
                    };
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
        
        internal static void RedirectToFrontendLogin(HttpResponse response, IServiceProvider provider, string errorCode)
        {
            var redirectService = provider
                .GetRequiredService<IFrontendRedirectService>();
            var redirectUrl = redirectService.GetHomeUrl(errorCode);
            response.Redirect(redirectUrl);
        }
    }
}
