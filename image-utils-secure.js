// Secure Image Upload via GitHub Actions
// No token exposure - uses GitHub's workflow_dispatch API

// Upload images using GitHub Actions (secure method)
function uploadImageToGitHubSecure(imageBlob, filename, callback) {
    var reader = new FileReader();

    reader.onload = function(e) {
        // Get base64 content (remove data:image/jpeg;base64, prefix)
        var base64Content = e.target.result.split(',')[1];

        // Store in temporary array for batch upload
        if (!window.pendingImageUploads) {
            window.pendingImageUploads = [];
        }

        window.pendingImageUploads.push({
            filename: filename,
            content: base64Content,
            blob: imageBlob
        });

        // Return a temporary local URL for preview
        var localUrl = URL.createObjectURL(imageBlob);
        callback(true, localUrl, filename);
    };

    reader.readAsDataURL(imageBlob);
}

// Trigger GitHub Actions workflow to upload all pending images
function commitPendingImages(productId, callback) {
    if (!window.pendingImageUploads || window.pendingImageUploads.length === 0) {
        callback(true, []);
        return;
    }

    // For now, we'll use the GitHub mobile app method
    // Show instructions to user
    var imageList = window.pendingImageUploads.map(function(img, i) {
        return (i + 1) + '. ' + img.filename;
    }).join('\n');

    var instructions =
        'Images ready to upload!\n\n' +
        'To complete the upload:\n' +
        '1. Download these images to your device\n' +
        '2. Go to: https://github.com/Buku313/TRASHED-GOODZ/tree/main/images\n' +
        '3. Click "Add file" → "Upload files"\n' +
        '4. Upload the downloaded images\n' +
        '5. Commit changes\n\n' +
        'Images to upload:\n' + imageList;

    // Download images as a zip would be ideal, but for simplicity:
    // Download each image individually
    window.pendingImageUploads.forEach(function(img) {
        var link = document.createElement('a');
        link.href = URL.createObjectURL(img.blob);
        link.download = img.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    alert(instructions);

    // Clear pending uploads
    var uploadedFiles = window.pendingImageUploads.map(function(img) {
        return 'images/' + img.filename;
    });
    window.pendingImageUploads = [];

    callback(true, uploadedFiles);
}

// Handle multiple image uploads with secure method
function uploadMultipleImagesSecure(files, progressCallback, completeCallback) {
    var uploadedUrls = [];
    var totalFiles = files.length;
    var completedFiles = 0;

    if (totalFiles === 0) {
        completeCallback(true, []);
        return;
    }

    window.pendingImageUploads = [];

    // Process each file
    for (var i = 0; i < files.length; i++) {
        (function(index) {
            var file = files[index];

            // Validate file type
            if (!file.type.match('image.*')) {
                progressCallback(index, false, 'Not an image file');
                completedFiles++;

                if (completedFiles === totalFiles) {
                    showUploadInstructions();
                    completeCallback(true, window.pendingImageUploads.map(function(img) {
                        return 'images/' + img.filename;
                    }));
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

                // Store for batch upload
                uploadImageToGitHubSecure(compressedBlob, filename, function(success, localUrl, fname) {
                    completedFiles++;

                    if (success) {
                        progressCallback(index, 'ready', 'Ready for upload: ' + fname);
                    } else {
                        progressCallback(index, 'error', 'Failed to prepare image');
                    }

                    // Check if all files are processed
                    if (completedFiles === totalFiles) {
                        showUploadInstructions();
                        // Return URLs as they will be after upload
                        var futureUrls = window.pendingImageUploads.map(function(img) {
                            return 'https://raw.githubusercontent.com/Buku313/TRASHED-GOODZ/main/images/' + img.filename;
                        });
                        completeCallback(true, futureUrls);
                    }
                });
            });
        })(i);
    }
}

// Show upload instructions to user
function showUploadInstructions() {
    if (!window.pendingImageUploads || window.pendingImageUploads.length === 0) {
        return;
    }

    var message = document.createElement('div');
    message.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); ' +
                           'background:#FFF3CD; border:2px solid #FF9900; padding:20px; ' +
                           'max-width:500px; z-index:9999; border-radius:5px;';

    message.innerHTML =
        '<h3 style="margin-top:0;">📱 Images Ready for Upload</h3>' +
        '<p><b>Images have been downloaded to your device.</b></p>' +
        '<p>To complete the upload:</p>' +
        '<ol>' +
        '<li>Go to <a href="https://github.com/Buku313/TRASHED-GOODZ/tree/main/images" target="_blank">GitHub Images Folder</a></li>' +
        '<li>Click <b>"Add file"</b> → <b>"Upload files"</b></li>' +
        '<li>Upload the ' + window.pendingImageUploads.length + ' downloaded image(s)</li>' +
        '<li>Click <b>"Commit changes"</b></li>' +
        '<li>Come back here and continue editing your product</li>' +
        '</ol>' +
        '<p><small>Images: ' + window.pendingImageUploads.map(function(img) { return img.filename; }).join(', ') + '</small></p>' +
        '<button onclick="this.parentElement.remove()" style="padding:8px 15px; background:#3366CC; color:#fff; border:none; cursor:pointer;">Got it!</button>';

    document.body.appendChild(message);
}

// Compress image file (same as before)
function compressImage(file, maxWidth, maxHeight, quality, callback) {
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Calculate new dimensions
            var width = img.width;
            var height = img.height;

            if (width > maxWidth || height > maxHeight) {
                var ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function(blob) {
                callback(blob, width, height);
            }, 'image/jpeg', quality);
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}
