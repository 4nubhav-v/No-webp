const fs = require('fs').promises;

async function convertWebPtoJPEG(webpPath, jpegPath) {
 try {
    const { execSync } = require('child_process');
    
    // Use ImageMagick to convert WebP to JPEG
    await new Promise((resolve, reject) => {
      execSync(`cwebp ${webpPath} -o ${jpegPath}`, { stdio: 'inherit' }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    console.log(`WebP to JPEG conversion successful: ${jpegPath}`);
 } catch (error) {
    console.error(`Error converting WebP to JPEG: ${error.message}`);
 }
}

async function convertWebPtoPNG(webpPath, pngPath) {
 try {
    const image = await loadImage(webpPath);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    const pngData = canvas.toDataURL('image/png').split(',')[1];
    fs.writeFile(pngPath, Buffer.from(pngData, 'base64'));
    
    console.log(`WebP to PNG conversion successful: ${pngPath}`);
 } catch (error) {
    console.error(`Error converting WebP to PNG: ${error.message}`);
 }
}

async function convertWebPtoGIF(webpPath, gifPath) {
 try {
    const webpImage = await loadImage(webpPath);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = webpImage.width;
    canvas.height = webpImage.height;
    
    const frames = [];
    for (let i = 0; i < 30; i++) { // Assuming 30 fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(webpImage, 0, 0);
      frames.push(canvas.toDataURL('image/webp'));
      
      await new Promise(resolve => setTimeout(resolve, 33)); // ~33ms per frame
    }
    
    const gifData = frames.join(',');
    fs.writeFile(gifPath, Buffer.from(gifData, 'base64'));
    
    console.log(`WebP to GIF conversion successful: ${gifPath}`);
 } catch (error) {
    console.error(`Error converting WebP to GIF: ${error.message}`);
 }
}

function loadImage(path) {
 return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = path;
 });
}

module.exports = {
 convertWebPtoJPEG,
 convertWebPtoPNG,
 convertWebPtoGIF
};
