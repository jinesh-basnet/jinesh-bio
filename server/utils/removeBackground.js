const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Remove background from an image using remove.bg API
 * @param {string} inputPath - Path to the input image
 * @param {string} outputPath - Path to save the output image
 * @param {string} apiKey - Remove.bg API key (optional, uses free tier if not provided)
 * @returns {Promise<string>} - Path to the processed image
 */
async function removeBackground(inputPath, outputPath, apiKey = null) {
    try {
        if (!apiKey) {
            console.log('No remove.bg API key provided. Skipping background removal.');
            return inputPath;
        }

        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(inputPath));
        formData.append('size', 'auto');

        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': apiKey,
            },
            encoding: null
        });

        if (response.status !== 200) {
            console.error('Error removing background:', response.status, response.statusText);
            return inputPath;
        }

        fs.writeFileSync(outputPath, response.data);

        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }

        console.log('Background removed successfully');
        return outputPath;

    } catch (error) {
        console.error('Error in removeBackground:', error.message);
        return inputPath;
    }
}

async function optimizeImage(inputPath, outputPath) {
    try {
        fs.copyFileSync(inputPath, outputPath);
        return outputPath;
    } catch (error) {
        console.error('Error optimizing image:', error.message);
        return inputPath;
    }
}

module.exports = {
    removeBackground,
    optimizeImage
};
