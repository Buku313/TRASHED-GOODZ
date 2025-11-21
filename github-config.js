// GitHub API Configuration
// IMPORTANT: Replace these values with your actual GitHub information

var GITHUB_CONFIG = {
    // Your GitHub username
    owner: 'Buku313',

    // Your repository name
    repo: 'TRASHED-GOODZ',

    // GitHub Personal Access Token
    // Generate one at: https://github.com/settings/tokens
    // Required permissions: "repo" (Full control of private repositories)
    // KEEP THIS SECRET! Anyone with this token can modify your repository
    token: 'YOUR_GITHUB_TOKEN_HERE',

    // Branch to commit to (usually 'main' or 'master')
    branch: 'main',

    // Path to data file in repository
    dataFile: 'data.json'
};

// Check if configuration is complete
function isGitHubConfigured() {
    return GITHUB_CONFIG.token && GITHUB_CONFIG.token !== 'YOUR_GITHUB_TOKEN_HERE';
}