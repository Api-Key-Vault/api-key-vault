namespace ApiKeyVault.Application.Dtos.ApiKeyAccess
{
    public enum GrantAccessResult
    {
        Success,
        Forbidden,
        NotFound,
        AlreadyExists,
        UnexpectedError
    }
}
