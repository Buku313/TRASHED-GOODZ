// GitHub API Configuration Template
// IMPORTANT: Copy this file to 'github-config.js' and add your actual token

var GITHUB_CONFIG = {
    // Your GitHub username
    owner: 'Buku313',

    // Your repository name
    repo: 'TRASHED-GOODZ',

    // GitHub Personal Access Token
    // Generate one at: https://github.com/settings/tokens
    // Required permissions: "repo" (Full control of private repositories)
    // KEEP THIS SECRET! Never commit github-config.js to git!
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