using System.ComponentModel.DataAnnotations;

namespace ApiKeyVault.Application.Common.Options
{
    public class FrontendOptions
    {
        public const string SectionName = "Frontend";
        [Required(ErrorMessage = "Frontend:Origin configuration is required.")]
        public required string Origin { get; set; }

        [Required(ErrorMessage = "Frontend:DashboardPath configuration is required.")]
        public required string DashboardPath { get; init; }

        [Required(ErrorMessage = "Frontend:LoginPath configuration is required.")]
        public required string LoginPath { get; init; }

    }
}
