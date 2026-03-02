const convert = require('heic-convert');
const fs = require('fs').promises;
const path = require('path');

async function convertHeicToJpg() {
  const travelDir = path.join(__dirname, 'public', 'assets', 'travel');
  // Re-importing from original location if possible, or just re-converting with lower quality
  const files = await fs.readdir(travelDir);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

  for (const file of jpgFiles) {
    const inputPath = path.join(travelDir, file);
    const outputPath = path.join(travelDir, 'low-' + file);

    console.log(`Re-processing ${file} with lower quality...`);
    
    try {
      const inputBuffer = await fs.readFile(inputPath);
      // Since it's already a JPG, we might need a different tool to resize/compress
      // But let's try to just use a smaller version if we had the HEIC.
      // Wait, I deleted the HEIC. Let me check if they are still in app/assets
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }
}
