# apiKeyVault

![welcome to api key vault](readmeimage.png)

## Stack
- Backend: ASP.NET Core (Clean Architecture: `Api`, `Application`, `Domain`, `Infrastructure`)
- Frontend: React (vite) + Tailwind CSS
- Database: SQL Server 
- Auth: Github OAuth, cookie-based

## Prerequisites

- .NET 10 SDK
- Node.js (LTS)
- SQL Server
- Github OAuth app

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/lskld/api-key-vault.git\ 
cd apikeyvault
```

### 2. Backend

```bash
cd apikeyvault/ApiKeyVault.Api
dotnet restore
dotnet ef database update
dotnet run
```
The API starts on the URL configured in `launchsettings.json` (default: https://localhost:7065)

### 3. Frontend

In a second terminal:

```bash
cd apikeyvault-frontend
npm install
npm run dev
```

## User Secrets
The backend uses .NET User Secrets for local configuration

Run from the ApiKeyVault.Api folder:
```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your-connection-string>"
dotnet user-secrets set "Authentication:GitHub:ClientId" "<your-client-id>"
dotnet user-secrets set "Authentication:GitHub:ClientSecret" "<your-client-secret>"
```

## Frontend components 

### RetroUI (pixel-art components)
The project uses RetroUI components which are pixel-art styled React components like (buttons, cards, inputs etc.).

Before implementing, please read docs: [retroui](https://retroui.io/)

Example implementation of a Button:
```html
<Button
  bg="var(--color-primary-accent)"
  textColor="var(--color-text)"
  borderColor="var(--color-border)"
  shadow="var(--color-shadow)"
>
  Click Me!
</Button>
```

All components accept normal Tailwind classes via className.

### Pixelarticons
Icons come from [pixelarticons](https://pixelarticons.com/), we only use the ones included in the free version.

To use an item, add them into the className. Example:
```html
<span className="pixelart-icons-font-key" />
```
The icons also accept tailwind css, so you can change for ex. color and size like this:
```html
<span className="pixelart-icons-font-key text-text-on-accent text-[50px]!" />
```

## Azure Data Protection

API keys and auth cookies are encrypted with ASP.NET Core Data Protection.
In Azure, the key ring is stored in Blob Storage and encrypted with Azure Key Vault.

### Environment variables
   Variable | Description |
 |---|---|
 | `DataProtection__BlobUri` | URI of the key ring blob, e.g. `https://<account>.blob.core.windows.net/<container>/keys.xml` |
 | `DataProtection__KeyVaultKeyUri` | Versionless key identifier, e.g. `https://<vault>.vault.azure.net/keys/data-protection` |

If both are set, Azure mode is active. If either is empty or missing, the app
falls back to the local default key ring. No secrets are used. Authentication runs through managed identity.

### Required Azure resources

- Storage account with one container for the key ring. Do not create the key
  file manually, the app creates it on first start.
- Key Vault with the Azure RBAC permission model
  (not access policies).

### Key Vault key

Create a key in the vault (for example `data-protection`) and configure its versionless identifier. Rotating the key is fine. Never delete old key versions, existing data protection keys are encrypted with them.

### Role assignments

Assign these roles to the app's managed identity. Nothing else is required:

- Storage Blob Data Contributor, scoped to the container.
- Key Vault Crypto User, scoped to the vault.

### Application name

The application discriminator is set to `ApiKeyVault` for all instances in the
same environment. Do not change it in an environment with existing encrypted
API keys, they become undecryptable.

### Environments and verification

Use separate storage accounts, containers, and vaults per environment
(dev, staging, production). Verification across instances is run at deployment:
start two instances against the same configuration, protect a value in one and
unprotect it in the other.