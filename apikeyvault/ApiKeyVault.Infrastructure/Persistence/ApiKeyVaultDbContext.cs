using ApiKeyVault.Domain.Entities;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace ApiKeyVault.Infrastructure.Persistence
{
    public class ApiKeyVaultDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApiKeyVaultDbContext(DbContextOptions<ApiKeyVaultDbContext> options) : base(options)
        {

        }

        public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
        public DbSet<Team> Teams => Set<Team>();
        public DbSet<TeamInvite> TeamInvites => Set<TeamInvite>();
        public DbSet<ApiKey> ApiKeys => Set<ApiKey>();
        public DbSet<ApiKeyAccess> ApiKeyAccesses => Set<ApiKeyAccess>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<TeamMember>(teamMember =>
            {
                teamMember.HasIndex(member => new
                {
                    member.TeamId,
                    member.UserId
                })
                .IsUnique();

                teamMember.HasOne<ApplicationUser>()
                    .WithMany(user => user.TeamMemberships)
                    .HasForeignKey(member => member.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                teamMember.HasOne(member => member.Team)
                    .WithMany(team => team.Members)
                    .HasForeignKey(member => member.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                teamMember.HasOne(member => member.Role)
                    .WithMany(role => role.Members)
                    .HasForeignKey(member => member.RoleId)
                    .OnDelete(DeleteBehavior.NoAction);
            });


            builder.Entity<TeamInvite>(teamInvite =>
            {
                teamInvite.HasOne(invite => invite.CreatedByMember)
                    .WithMany(member => member.CreatedInvites)
                    .HasForeignKey(invite => invite.CreatedByMemberId)
                    .OnDelete(DeleteBehavior.NoAction);

                teamInvite.HasOne(invite => invite.UsedByMember)
                    .WithMany(member => member.UsedInvites)
                    .HasForeignKey(invite => invite.UsedByMemberId)
                    .OnDelete(DeleteBehavior.NoAction);

                teamInvite.HasOne(invite => invite.Team)
                    .WithMany(team => team.Invites)
                    .HasForeignKey(invite => invite.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                teamInvite.Property(invite => invite.TokenHash)
                    .IsUnicode(false)
                    .HasMaxLength(255);
            });


            builder.Entity<ApiKey>(apiKeyConfiguration =>
            {
                apiKeyConfiguration.HasOne(apiKey => apiKey.Team)
                    .WithMany(team => team.ApiKeys)
                    .HasForeignKey(apiKey => apiKey.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                apiKeyConfiguration.HasOne(apiKey => apiKey.CreatedByMember)
                    .WithMany(member => member.CreatedApiKeys)
                    .HasForeignKey(apiKey => apiKey.CreatedByMemberId)
                    .OnDelete(DeleteBehavior.NoAction);

            });

            builder.Entity<ApiKeyAccess>(apiKeyAccess =>
            {
                apiKeyAccess.HasKey(access => new
                {
                    access.ApiKeyId,
                    access.TeamMemberId
                });

                apiKeyAccess.HasOne(access => access.ApiKey)
                .WithMany(apiKey => apiKey.ApiKeyAccesses)
                .HasForeignKey(access => access.ApiKeyId)
                .OnDelete(DeleteBehavior.Cascade);

                apiKeyAccess.HasOne(access => access.Member)
                .WithMany(member => member.GrantedApiKeyAccesses)
                .HasForeignKey(access => access.TeamMemberId)
                .OnDelete(DeleteBehavior.NoAction);

                apiKeyAccess.HasOne(access => access.GrantedByMember)
                .WithMany(member => member.CreatedApiKeyAccesses)
                .HasForeignKey(access => access.GrantedByMemberId)
                .OnDelete(DeleteBehavior.NoAction);
            });


            builder.Entity<TeamRole>().HasData(
                new TeamRole
                {
                    Id = 1,
                    Name = "Owner"
                },
                new TeamRole
                {
                    Id = 2,
                    Name = "Member"
                }
            );
        }
    }
}
