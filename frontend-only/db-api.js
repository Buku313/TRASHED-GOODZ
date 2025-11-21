// Simple Database API Handler
// Works with JSONBin.io

class DatabaseAPI {
    constructor() {
        this.baseUrl = 'https://api.jsonbin.io/v3';
    }

    // Get API key from localStorage
    getAPIKey() {
        return getAPIKey(); // From db-config.js
    }

    // Get Bin ID from localStorage
    getBinId() {
        return getBinId(); // From db-config.js
    }

    // Load products from database
    async loadProducts() {
        const binId = this.getBinId();

        if (!binId) {
            console.log('Database not configured yet');
            return this.getDefaultData();
        }

        const apiKey = this.getAPIKey();
        if (!apiKey) {
            console.log('API key not configured');
            return this.getDefaultData();
        }

        try {
            const response = await fetch(`${this.baseUrl}/b/${binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.record || this.getDefaultData();
        } catch (error) {
            console.error('Error loading products:', error);
            return this.getDefaultData();
        }
    }

    // Save products to database
    async saveProducts(data) {
        const apiKey = this.getAPIKey();

        if (!apiKey) {
            throw new Error('Please configure your JSONBin API key first!');
        }

        try {
            const binId = this.getBinId();
            let url, method;

            // If bin doesn't exist, create it
            if (!binId) {
                url = `${this.baseUrl}/b`;
                method = 'POST';
            } else {
                url = `${this.baseUrl}/b/${binId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey,
                    'X-Bin-Name': 'trashedgoods-products',
                    'X-Bin-Private': 'true'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // If we just created a new bin, save the ID to localStorage
            if (method === 'POST' && result.metadata && result.metadata.id) {
                const newBinId = result.metadata.id;
                setBinId(newBinId); // Save to localStorage
                console.log('🎉 New database created! Bin ID saved:', newBinId);
            }

            return result;
        } catch (error) {
            console.error('Error saving products:', error);
            throw error;
        }
    }

    // Upload image with multiple fallback options
    async uploadImage(imageFile) {
        // Try imgbb first (if configured)
        const imgbbKey = localStorage.getItem('tgs_imgbb_api_key');
        if (imgbbKey) {
            try {
                console.log('Trying imgbb upload...');
                const url = await this.uploadToImgbb(imageFile, imgbbKey);
                console.log('imgbb upload successful:', url);
                return url;
            } catch (error) {
                console.warn('imgbb upload failed, trying fallback:', error.message);
            }
        }

        // Fallback 1: Try Cloudinary (if configured)
        const cloudinaryConfig = this.getCloudinaryConfig();
        if (cloudinaryConfig) {
            try {
                console.log('Trying Cloudinary upload...');
                const url = await this.uploadToCloudinary(imageFile, cloudinaryConfig);
                console.log('Cloudinary upload successful:', url);
                return url;
            } catch (error) {
                console.warn('Cloudinary upload failed, trying fallback:', error.message);
            }
        }

        // Fallback 2: Base64 embedding (for small images < 500KB)
        if (imageFile.size < 500000) {
            console.log('Using base64 embedding for small image...');
            const base64 = await this.fileToBase64(imageFile);
            console.log('Base64 embedding successful');
            return base64;
        }

        // If all else fails, show manual upload instructions
        throw new Error(
            'Image upload failed!\n\n' +
            'Please configure an image hosting service:\n\n' +
            '1. IMGBB (Recommended):\n' +
            '   - Go to https://api.imgbb.com/\n' +
            '   - Click "Get API Key" (free)\n' +
            '   - Enter key in Settings ⚙️\n\n' +
            '2. CLOUDINARY (Alternative):\n' +
            '   - Go to https://cloudinary.com/users/register_free\n' +
            '   - Get your cloud name and upload preset\n' +
            '   - Enter in Settings ⚙️\n\n' +
            '3. Manual GitHub Upload:\n' +
            '   - Upload images to GitHub /images folder\n' +
            '   - Use raw.githubusercontent.com URLs'
        );
    }

    // Upload to imgbb
    async uploadToImgbb(imageFile, apiKey) {
        const base64 = await this.fileToBase64(imageFile);
        const base64Data = base64.split(',')[1];

        const formData = new FormData();
        formData.append('image', base64Data);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('imgbb error response:', errorText);
            throw new Error(`imgbb error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.success || !result.data?.url) {
            throw new Error(result.error?.message || 'Upload failed - no URL returned');
        }

        return result.data.url;
    }

    // Upload to Cloudinary
    async uploadToCloudinary(imageFile, config) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', config.uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudinary error response:', errorText);
            throw new Error(`Cloudinary error: ${response.status}`);
        }

        const result = await response.json();
        if (!result.secure_url) {
            throw new Error('Cloudinary upload failed - no URL returned');
        }

        return result.secure_url;
    }

    // Get Cloudinary config from localStorage
    getCloudinaryConfig() {
        const cloudName = localStorage.getItem('tgs_cloudinary_cloud_name');
        const uploadPreset = localStorage.getItem('tgs_cloudinary_upload_preset');

        if (cloudName && uploadPreset) {
            return { cloudName, uploadPreset };
        }
        return null;
    }

    // Helper: Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Helper: Compress image before upload with better quality
    async compressImage(file, maxWidth = 1200, quality = 0.85) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Only resize if image is larger than maxWidth
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');

                    // Enable image smoothing for better quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Draw image
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // Create file with proper name
                        const fileName = file.name.replace(/\.[^.]+$/, '.jpg');
                        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
                    }, 'image/jpeg', quality);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Default data structure
    getDefaultData() {
        return {
            products: [],
            categories: [
                'Electronics',
                'Fashion',
                'Home & Garden',
                'Collectibles',
                'Sports',
                'Music',
                'Books',
                'Toys',
                'Other'
            ]
        };
    }
}

// Create global instance
window.db = new DatabaseAPI();
