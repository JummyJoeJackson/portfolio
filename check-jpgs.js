const fs = require('fs').promises;
const path = require('path');

async function resizeImages() {
  const travelDir = path.join(__dirname, 'public', 'assets', 'travel');
  const files = await fs.readdir(travelDir);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

  console.log('Found JPG files:', jpgFiles);
  // Without sharp, we can't easily resize. 
  // But let's check if the browser can load them directly first.
  // The issue might be the image format or size.
}
resizeImages();
