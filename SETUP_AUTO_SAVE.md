# Setup Auto-Save to GitHub

To enable seamless auto-save (so changes go live automatically), you need to configure GitHub API access.

## Step 1: Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "TRASHEDGOODS Admin Panel"
4. Set expiration (recommend "No expiration" for convenience)
5. **Check the "repo" permission** (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** - you won't see it again!

## Step 2: Configure the Token (LOCAL ONLY - DO NOT COMMIT!)

1. Copy the template file:
   ```bash
   cp github-config.example.js github-config.js
   ```

2. Open `github-config.js` (this file is ignored by git)
3. Replace `'YOUR_GITHUB_TOKEN_HERE'` with your actual token:
   ```javascript
   token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
   ```

4. Save the file (DO NOT commit it - it's in .gitignore)

**IMPORTANT:** The `github-config.js` file stays LOCAL on your computer only. It's in `.gitignore` so it won't be committed to GitHub. This keeps your token secure!

## Step 3: Test Auto-Save

1. Go to your admin panel: https://buku313.github.io/TRASHED-GOODZ/login.html
2. Login (admin / trashedgoods2008)
3. Make a change to any item
4. You should see "⏳ Saving to GitHub..." then "✓ Saved to GitHub!"
5. Wait 1-2 minutes and check your live site - changes should appear!

## Security Notes

⚠️ **IMPORTANT:** Your GitHub token gives full access to your repositories!

- Never share your token publicly
- The token will be visible in your repository (public repos expose it)
- For public repos, consider using GitHub Actions instead (more secure)
- You can revoke the token anytime at https://github.com/settings/tokens

## If Auto-Save Doesn't Work

If you see errors or don't want to use auto-save:

1. Click "Export Data to File" in the admin panel
2. Save the file as `data.json`
3. Commit manually:
   ```bash
   git add data.json
   git commit -m "Update store data"
   git push
   ```

## Alternative: Manual Workflow (More Secure for Public Repos)

If you don't want to expose your GitHub token:

1. Keep `github-config.js` with `token: 'YOUR_GITHUB_TOKEN_HERE'` (don't configure it)
2. Use "Export Data to File" button
3. Commit manually via git

This way your token never goes into the repository.
