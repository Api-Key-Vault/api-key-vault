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
                teamMember.HasOne<ApplicationUser>()
                    .WithMany()
                    .HasForeignKey(tm => tm.UserId);

                teamMember.HasOne(tm => tm.Team)
                    .WithMany(t => t.Members)
                    .HasForeignKey(tm => tm.TeamId);

                teamMember.HasOne(tm => tm.Role)
                    .WithMany(t => t.Members)
                    .HasForeignKey(tm => tm.RoleId);
            });


            builder.Entity<TeamInvite>(teamInvite =>
            {
                teamInvite.HasOne(ti => ti.CreatedByMember)
                    .WithMany(tm => tm.CreatedInvites)
                    .HasForeignKey(ti => ti.CreatedByMemberId);

                teamInvite.HasOne(ti => ti.UsedByMember)
                    .WithMany(tm => tm.UsedInvites)
                    .HasForeignKey(ti => ti.UsedByMemberId);

                teamInvite.HasOne(ti => ti.Team)
                    .WithMany(t => t.Invites)
                    .HasForeignKey(ti => ti.TeamId);

                teamInvite.Property(ti => ti.TokenHash)
                    .IsUnicode(false)
                    .HasMaxLength(255);
            });


            builder.Entity<ApiKey>(apiKey =>
            {
                apiKey.HasOne(ak => ak.Team)
                    .WithMany(t => t.ApiKeys)
                    .HasForeignKey(ak => ak.TeamId);

                apiKey.HasOne(ak => ak.CreatedByMember)
                    .WithMany(tm => tm.CreatedApiKeys)
                    .HasForeignKey(ak => ak.CreatedByMemberId);

                apiKey.Property(ak => ak.EncryptedValue)
                    .IsUnicode(false)
                    .HasMaxLength(255);

            });

            builder.Entity<ApiKeyAccess>(apiKeyAccess =>
            {
                apiKeyAccess.HasKey(aka => new
                {
                    aka.ApiKeyId,
                    aka.TeamMemberId
                });

                apiKeyAccess.HasOne(aka => aka.ApiKey)
                .WithMany(ak => ak.ApiKeyAccesses)
                .HasForeignKey(aka => aka.ApiKeyId);

                apiKeyAccess.HasOne(aka => aka.Member)
                .WithMany(tm => tm.GrantedApiKeyAccesses)
                .HasForeignKey(aka => aka.TeamMemberId);

                apiKeyAccess.HasOne(aka => aka.GrantedByMember)
                .WithMany(tm => tm.CreatedApiKeyAccesses)
                .HasForeignKey(aka => aka.GrantedByMemberId);
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
