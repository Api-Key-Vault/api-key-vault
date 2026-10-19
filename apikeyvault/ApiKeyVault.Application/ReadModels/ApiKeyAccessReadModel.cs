using System;
using System.Collections.Generic;
using System.Text;

namespace ApiKeyVault.Application.ReadModels
{
    public class ApiKeyAccessReadModel
    {
        public int ApiKeyId { get; set; }
        public int TeamMemberId { get; set; }
        public string DisplayName { get; set; } = string.Empty;      
        public DateTime AssignedAt { get; set; }
    }
}
