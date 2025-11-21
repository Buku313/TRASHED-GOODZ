// Image Compression and Upload Utilities for TRASHEDGOODS.STORE
// Handles image compression and uploading to GitHub repository

// Compress image file before upload
function compressImage(file, maxWidth, maxHeight, quality, callback) {
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Calculate new dimensions while maintaining aspect ratio
            var width = img.width;
            var height = img.height;

            if (width > maxWidth || height > maxHeight) {
                var ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(function(blob) {
                callback(blob, width, height);
            }, 'image/jpeg', quality);
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Upload image to GitHub repository
function uploadImageToGitHub(imageBlob, filename, callback) {
    // Check if GitHub config is available
    if (typeof GITHUB_CONFIG === 'undefined' || !isGitHubConfigured()) {
        callback(false, 'GitHub not configured');
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        // Get base64 content (remove data:image/jpeg;base64, prefix)
        var base64Content = e.target.result.split(',')[1];

        // Create path in images folder
        var imagePath = 'images/' + filename;
        var url = 'https://api.github.com/repos/' + GITHUB_CONFIG.owner + '/' + GITHUB_CONFIG.repo + '/contents/' + imagePath;

        // Check if file exists first
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + GITHUB_CONFIG.token,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            return null; // File doesn't exist, that's okay
        })
        .then(function(existingFile) {
            // Upload the file
            var uploadData = {
                message: 'Upload product image: ' + filename,
                content: base64Content,
                branch: GITHUB_CONFIG.branch
            };

            // If file exists, include SHA for update
            if (existingFile && existingFile.sha) {
                uploadData.sha = existingFile.sha;
            }

            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': 'token ' + GITHUB_CONFIG.token,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadData)
            });
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
            return response.json();
        })
        .then(function(result) {
            // Return the raw GitHub URL for the image
            var imageUrl = 'https://raw.githubusercontent.com/' + GITHUB_CONFIG.owner + '/' +
                          GITHUB_CONFIG.repo + '/' + GITHUB_CONFIG.branch + '/' + imagePath;
            callback(true, imageUrl);
        })
        .catch(function(error) {
            console.error('Image upload error:', error);
            callback(false, error.message);
        });
    };

    reader.readAsDataURL(imageBlob);
}

// Handle multiple image uploads with progress tracking
function uploadMultipleImages(files, progressCallback, completeCallback) {
    var uploadedUrls = [];
    var totalFiles = files.length;
    var completedFiles = 0;
    var hasError = false;

    if (totalFiles === 0) {
        completeCallback(true, []);
        return;
    }

    // Process each file
    for (var i = 0; i < files.length; i++) {
        (function(index) {
            var file = files[index];

            // Validate file type
            if (!file.type.match('image.*')) {
                progressCallback(index, false, 'Not an image file');
                completedFiles++;
                hasError = true;

                if (completedFiles === totalFiles) {
                    completeCallback(!hasError, uploadedUrls);
                }
                return;
            }

            // Generate unique filename
            var timestamp = Date.now();
            var randomStr = Math.random().toString(36).substring(7);
            var extension = file.name.split('.').pop().toLowerCase();
            var filename = 'product_' + timestamp + '_' + randomStr + '.' + extension;

            // Compress image (max 800x800, 0.8 quality)
            compressImage(file, 800, 800, 0.8, function(compressedBlob, width, height) {
                progressCallback(index, 'compressing', 'Compressed to ' + width + 'x' + height);

                // Upload to GitHub
                uploadImageToGitHub(compressedBlob, filename, function(success, result) {
                    completedFiles++;

                    if (success) {
                        uploadedUrls.push(result);
                        progressCallback(index, 'success', result);
                    } else {
                        hasError = true;
                        progressCallback(index, 'error', result);
                    }

                    // Check if all files are processed
                    if (completedFiles === totalFiles) {
                        completeCallback(!hasError, uploadedUrls);
                    }
                });
            });
        })(i);
    }
}

// Generate thumbnail preview from file
function generateThumbnail(file, maxSize, callback) {
    compressImage(file, maxSize, maxSize, 0.7, function(blob) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(blob);
    });
}

// Delete image from GitHub
function deleteImageFromGitHub(imageUrl, callback) {
    if (typeof GITHUB_CONFIG === 'undefined' || !isGitHubConfigured()) {
        callback(false, 'GitHub not configured');
        return;
    }

    // Extract path from GitHub raw URL
    var pathMatch = imageUrl.match(/githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/(.+)$/);
    if (!pathMatch) {
        callback(false, 'Invalid GitHub URL');
        return;
    }

    var imagePath = pathMatch[1];
    var url = 'https://api.github.com/repos/' + GITHUB_CONFIG.owner + '/' + GITHUB_CONFIG.repo + '/contents/' + imagePath;

    // Get file SHA first
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + GITHUB_CONFIG.token,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Image not found');
        }
        return response.json();
    })
    .then(function(fileData) {
        // Delete the file
        var deleteData = {
            message: 'Delete product image: ' + imagePath,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        };

        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'token ' + GITHUB_CONFIG.token,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        });
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        callback(true, 'Image deleted');
    })
    .catch(function(error) {
        console.error('Image delete error:', error);
        callback(false, error.message);
    });
}
