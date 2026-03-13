const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

async function fixImage() {
  const inputPath = path.join(__dirname, '..', 'public', 'assets', 'travel', 'muskoka.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'assets', 'travel', 'muskoka_fixed.jpg');

  console.log(`Reading image from: ${inputPath}`);
  const inputBuffer = fs.readFileSync(inputPath);

  console.log('Converting HEIC to JPEG...');
  try {
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });

    fs.writeFileSync(outputPath, outputBuffer);
    console.log(`Successfully converted. Saved to: ${outputPath}`);
    
    // Replace original
    fs.renameSync(outputPath, inputPath);
    console.log('Replaced original muskoka.jpg with the converted version.');
  } catch (error) {
    console.error('Error converting image:', error);
  }
}

fixImage();
