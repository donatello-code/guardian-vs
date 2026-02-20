# Guardian VS Publishing Guide

This guide provides step-by-step instructions for publishing the Guardian VS extension to the Visual Studio Code Marketplace.

## Prerequisites

1. **Azure DevOps Account** (Microsoft account)
2. **VS Code Marketplace Publisher Account** (created at https://marketplace.visualstudio.com/manage/publishers/guardianvs)
3. **Personal Access Token (PAT)** with Marketplace publish permissions
4. **Node.js** (v20 or later recommended)
5. **npm** or **yarn**

## Step 1: Create Publisher Account (One-time Setup)

If you haven't already created a publisher:

1. Go to https://marketplace.visualstudio.com/manage/publishers/guardianvs
2. Sign in with your Microsoft account
3. Create a new publisher named "GuardianVS"
4. Accept the Marketplace terms and conditions

## Step 2: Generate Personal Access Token (PAT)

1. Go to https://dev.azure.com/
2. Sign in with your Microsoft account
3. Click on your profile picture → **Personal access tokens**
4. Click **New Token**
5. Configure the token:
   - **Name**: `VS Code Marketplace Publishing`
   - **Organization**: `All accessible organizations`
   - **Scopes**: Select `Marketplace (Publish)`
   - **Expiration**: Set appropriate duration (e.g., 1 year)
6. Click **Create** and **copy the token** (you won't see it again!)

## Step 3: Install Publishing Tools

```bash
# Install vsce (Visual Studio Code Extension Manager) globally
npm install -g @vscode/vsce

# Install ovsx (Open VSX Registry) if you want to publish to open-vsx.org
npm install -g ovsx
```

## Step 4: Login to Marketplace

```bash
# Login with your publisher ID
vsce login GuardianVS

# When prompted, paste your Personal Access Token (PAT)
```

## Step 5: Prepare for Publishing

### Update Version Number
Before publishing, update the version in `package.json`:

```json
"version": "X.Y.Z"
```

Follow semantic versioning:
- **MAJOR** (X): Breaking changes
- **MINOR** (Y): New features, backward compatible
- **PATCH** (Z): Bug fixes

### Update Changelog
Update `CHANGELOG.md` with changes for the new version.

## Step 6: Build and Package

```bash
# Install dependencies
npm install
cd webview-ui && npm install && cd ..

# Build the extension
npm run package

# This runs:
# - npm run check-types (TypeScript compilation)
# - npm run build:webview (Webview UI build)
# - npm run lint (Code linting)
# - node esbuild.mjs --production (Production bundling)
```

## Step 7: Create VSIX Package

```bash
# Create VSIX file
vsce package

# This will create: guardian-vs-X.Y.Z.vsix
```

## Step 8: Test the VSIX Locally

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Click "..." menu → "Install from VSIX..."
4. Select the generated `.vsix` file
5. Test the extension thoroughly

## Step 9: Publish to Marketplace

### Option A: Publish Stable Release
```bash
vsce publish --allow-package-secrets sendgrid
```

### Option B: Publish Pre-release
```bash
vsce publish --allow-package-secrets sendgrid --pre-release
```

### Option C: Publish to Open VSX (optional)
```bash
ovsx publish
```

## Step 10: Verify Publication

1. Visit https://marketplace.visualstudio.com/items?itemName=GuardianVS.guardian-vs
2. Check that the new version appears
3. Verify extension details are correct

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```bash
   # Re-login if token expired
   vsce logout
   vsce login GuardianVS
   ```

2. **Build Failures**
   - Check TypeScript errors: `npm run check-types`
   - Check webview build: `cd webview-ui && npm run build`
   - Ensure all dependencies are installed

3. **Publishing Permission Errors**
   - Verify PAT has "Marketplace (Publish)" scope
   - Verify you're using correct publisher ID

4. **Version Conflicts**
   - Ensure version number is unique and higher than previous versions
   - Check if version already exists in Marketplace

### Environment Variables

If you have package secrets (like SendGrid API key), set them as environment variables:

```bash
export SENDGRID_API_KEY="your-api-key"
```

## Automated Publishing Script

For convenience, you can use the npm script:

```bash
# Publish to both VS Code Marketplace and Open VSX
npm run publish:marketplace

# Publish pre-release
npm run publish:marketplace:prerelease
```

## Post-Publishing Checklist

- [ ] Verify extension appears in Marketplace
- [ ] Test installation from Marketplace
- [ ] Update documentation if needed
- [ ] Announce release to users
- [ ] Monitor for any issues reported

## Useful Links

- **Marketplace Management**: https://marketplace.visualstudio.com/manage/publishers/guardianvs
- **Extension Page**: https://marketplace.visualstudio.com/items?itemName=GuardianVS.guardian-vs
- **VS Code Extension Authoring**: https://code.visualstudio.com/api
- **vsce Documentation**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Version History Template

When updating `CHANGELOG.md`, use this format:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature 1
- New feature 2

### Changed
- Improved existing feature

### Fixed
- Bug fix 1
- Bug fix 2

### Removed
- Deprecated feature removed
```

---

**Remember**: Always test the VSIX locally before publishing to ensure quality and avoid breaking changes for users.