// GitHub API Integration for Auto-Saving Data
// This allows the admin panel to automatically commit changes to GitHub

// Save data to GitHub repository
function saveToGitHub(callback) {
    // Check if github-config.js is loaded
    if (typeof GITHUB_CONFIG === 'undefined') {
        alert('AUTO-SAVE NOT AVAILABLE ON GITHUB PAGES\n\nAuto-save only works when running locally because your GitHub token must stay private.\n\nTo update the live site:\n1. Click "Export Data to File"\n2. Save as data.json\n3. Commit to GitHub\n\nOR run the admin panel locally for auto-save.');
        if (callback) callback(false);
        return;
    }

    if (!isGitHubConfigured()) {
        alert('GitHub integration not configured!\n\nPlease edit github-config.js and add your GitHub Personal Access Token.\n\nFor now, use the "Export Data to File" button and commit manually.');
        if (callback) callback(false);
        return;
    }

    var data = {
        items: JSON.parse(localStorage.getItem('tgs_items')) || [],
        categories: JSON.parse(localStorage.getItem('tgs_categories')) || [],
        hotCategories: JSON.parse(localStorage.getItem('tgs_hotCategories')) || []
    };

    var content = JSON.stringify(data, null, 2);
    var encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Step 1: Get current file SHA (required for updating)
    var url = 'https://api.github.com/repos/' + GITHUB_CONFIG.owner + '/' + GITHUB_CONFIG.repo + '/contents/' + GITHUB_CONFIG.dataFile;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + GITHUB_CONFIG.token,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to get current file');
        }
        return response.json();
    })
    .then(function(fileData) {
        // Step 2: Update the file with new content
        var updateData = {
            message: 'Update store data from admin panel',
            content: encodedContent,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        };

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + GITHUB_CONFIG.token,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to update file');
        }
        return response.json();
    })
    .then(function(result) {
        alert('SUCCESS! Changes saved to GitHub.\n\nYour store will update in 1-2 minutes.\nEveryone will see your changes!');
        if (callback) callback(true);
    })
    .catch(function(error) {
        console.error('GitHub API Error:', error);
        alert('ERROR: Could not save to GitHub.\n\n' + error.message + '\n\nPlease check your GitHub token and try again, or use "Export Data to File" instead.');
        if (callback) callback(false);
    });
}

// Auto-save wrapper for admin functions
function autoSaveWrapper(originalFunction, functionName) {
    return function() {
        // Call the original function first
        var result = originalFunction.apply(this, arguments);

        // Show saving indicator
        showSavingIndicator();

        // Auto-save to GitHub after a short delay (to batch rapid changes)
        if (window.autoSaveTimeout) {
            clearTimeout(window.autoSaveTimeout);
        }

        window.autoSaveTimeout = setTimeout(function() {
            saveToGitHub(function(success) {
                hideSavingIndicator(success);
            });
        }, 2000); // Wait 2 seconds after last change

        return result;
    };
}

// Show saving indicator
function showSavingIndicator() {
    var indicator = document.getElementById('savingIndicator');
    if (indicator) {
        indicator.innerHTML = '<font color="#FF9900"><b>⏳ Saving to GitHub...</b></font>';
    }
}

// Hide saving indicator
function hideSavingIndicator(success) {
    var indicator = document.getElementById('savingIndicator');
    if (indicator) {
        if (success) {
            indicator.innerHTML = '<font color="#00CC00"><b>✓ Saved to GitHub!</b></font>';
            setTimeout(function() {
                indicator.innerHTML = '';
            }, 3000);
        } else {
            indicator.innerHTML = '<font color="#CC0000"><b>✗ Save failed - check console</b></font>';
        }
    }
}