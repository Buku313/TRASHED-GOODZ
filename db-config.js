// Database Configuration
// API key and Bin ID are stored in browser localStorage for security
// This file only contains the default admin password

var DB_CONFIG = {
    // Default admin password (you can change this)
    adminPassword: 'trashedgoods2008',

    // localStorage keys
    storageKeys: {
        apiKey: 'tgs_jsonbin_api_key',
        binId: 'tgs_jsonbin_bin_id',
        adminPassword: 'tgs_admin_password'
    }
};

// Get API key from localStorage
function getAPIKey() {
    return localStorage.getItem(DB_CONFIG.storageKeys.apiKey);
}

// Save API key to localStorage
function setAPIKey(apiKey) {
    localStorage.setItem(DB_CONFIG.storageKeys.apiKey, apiKey);
}

// Get Bin ID from localStorage
function getBinId() {
    return localStorage.getItem(DB_CONFIG.storageKeys.binId);
}

// Save Bin ID to localStorage
function setBinId(binId) {
    localStorage.setItem(DB_CONFIG.storageKeys.binId, binId);
}

// Get admin password (check localStorage first, then fall back to default)
function getAdminPassword() {
    return localStorage.getItem(DB_CONFIG.storageKeys.adminPassword) || DB_CONFIG.adminPassword;
}

// Save custom admin password to localStorage
function setAdminPassword(password) {
    localStorage.setItem(DB_CONFIG.storageKeys.adminPassword, password);
}

// Check if API key is configured
function isAPIKeyConfigured() {
    const apiKey = getAPIKey();
    return apiKey && apiKey.length > 0;
}

// Clear all stored configuration
function clearStoredConfig() {
    localStorage.removeItem(DB_CONFIG.storageKeys.apiKey);
    localStorage.removeItem(DB_CONFIG.storageKeys.binId);
    localStorage.removeItem(DB_CONFIG.storageKeys.adminPassword);
}
