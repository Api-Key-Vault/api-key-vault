namespace ApiKeyVault.Application.Dtos.Authentication
{
    public enum ExternalLoginResult
    {
        Success, 
        Invalid,
        LockedOut,
        NotAllowed,
        Failed
    }
}
