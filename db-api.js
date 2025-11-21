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

    // Upload image to imgbb (free image hosting)
    async uploadImage(imageFile) {
        try {
            // Get imgbb API key from localStorage
            const imgbbKey = localStorage.getItem('tgs_imgbb_api_key');

            if (!imgbbKey) {
                throw new Error('Image hosting not configured!\n\nTo upload images:\n1. Go to https://api.imgbb.com/\n2. Click "Get API Key" (free, no credit card)\n3. Copy your API key\n4. Click Settings ⚙️ in admin panel\n5. Enter your imgbb API key');
            }

            // Convert image to base64
            const base64 = await this.fileToBase64(imageFile);
            const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix

            // Create form data for imgbb API
            const formData = new FormData();
            formData.append('image', base64Data);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('imgbb error:', errorText);
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error?.message || 'Upload failed');
            }

            return result.data.url; // Returns the image URL
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
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

    // Helper: Compress image before upload
    async compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    }, 'image/jpeg', quality);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
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
