const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const travelDir = path.join(__dirname, 'public', 'assets', 'travel');
  const files = await fs.readdir(travelDir);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('-v2.jpg'));

  for (const file of jpgFiles) {
    const inputPath = path.join(travelDir, file);
    const outputPath = path.join(travelDir, file.replace('-v2.jpg', '-optimized.jpg'));

    console.log(`Optimizing ${file}...`);
    
    try {
      await sharp(inputPath)
        .resize(1200, 800, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);
      
      console.log(`Successfully optimized ${file}`);
    } catch (error) {
      console.error(`Failed to optimize ${file}:`, error);
    }
  }
}

optimizeImages();
