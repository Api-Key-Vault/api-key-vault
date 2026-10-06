using ApiKeyVault.Domain.Entities;
using ApiKeyVault.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

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

            builder.Entity<TeamMember>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(tm => tm.UserId);

            builder.Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(tm => tm.TeamId);

            builder.Entity<TeamMember>()
                .HasOne(tm => tm.Role)
                .WithMany(t => t.Members)
                .HasForeignKey(tm => tm.RoleId);

            builder.Entity<TeamInvite>()
                .HasOne(ti => ti.CreatedByMember)
                .WithMany(tm => tm.CreatedInvites)
                .HasForeignKey(ti => ti.CreatedByMemberId);

            builder.Entity<TeamInvite>()
                .HasOne(ti => ti.UsedByMember)
                .WithMany(tm => tm.UsedInvites)
                .HasForeignKey(ti => ti.UsedByMemberId);

            builder.Entity<TeamInvite>()
                .HasOne(ti => ti.Team)
                .WithMany(t => t.Invites)
                .HasForeignKey(ti => ti.TeamId);

            builder.Entity<ApiKey>()
                .HasOne(ak => ak.Team)
                .WithMany(t => t.ApiKeys)
                .HasForeignKey(ak => ak.TeamId);

            builder.Entity<ApiKey>()
                .HasOne(ak => ak.CreatedByMember)
                .WithMany(tm => tm.CreatedApiKeys)
                .HasForeignKey(ak => ak.CreatedByMemberId);

            builder.Entity<ApiKeyAccess>()
                .HasKey(aka => new
                {
                    aka.ApiKeyId,
                    aka.TeamMemberId
                });

            builder.Entity<ApiKeyAccess>()
                .HasOne(aka => aka.ApiKey)
                .WithMany(ak => ak.ApiKeyAccesses)
                .HasForeignKey(aka => aka.ApiKeyId);

            builder.Entity<ApiKeyAccess>()
                .HasOne(aka => aka.Member)
                .WithMany(tm => tm.GrantedApiKeyAccesses)
                .HasForeignKey(aka => aka.TeamMemberId);

            builder.Entity<ApiKeyAccess>()
                .HasOne(aka => aka.GrantedByMember)
                .WithMany(tm => tm.CreatedApiKeyAccesses)
                .HasForeignKey(aka => aka.GrantedByMemberId);

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
