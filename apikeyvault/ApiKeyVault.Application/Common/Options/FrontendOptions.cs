using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Application.Common.Options
{
    public class FrontendOptions
    {
        public const string SectionName = "Frontend";
        public required string Origin { get; set; }
        public string DashboardPath { get; init; } 
        public string LoginPath { get; init; }

    }
}
