namespace ApiKeyVault.Application.Dtos.ApiKeyAccess
{
    public class ApiKeyAccessServiceResponse
    {
        public GrantAccessResult Status { get; set; }
        public ApiKeyAccessResponse? Data { get; set; }
    }
}
