import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

async function optimizeImages() {
  console.log('🖼️  Optimizing images and creating icons...\n');

  try {
    // Convert existing JPG images to WebP
    const imagesToConvert = ['Brian_Day.jpg', 'Thomas_Grimm.jpg'];
    
    for (const image of imagesToConvert) {
      const inputPath = path.join(publicDir, image);
      const outputPath = path.join(publicDir, image.replace('.jpg', '.webp'));
      
      if (fs.existsSync(inputPath)) {
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        const originalSize = fs.statSync(inputPath).size;
        const newSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${image} → ${image.replace('.jpg', '.webp')}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB → New: ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)\n`);
      }
    }

    // Create temporary placeholder images for the missing icons
    // We'll use the existing host images as a base
    const baseImagePath = path.join(publicDir, 'Brian_Day.jpg');
    
    if (fs.existsSync(baseImagePath)) {
      console.log('🎨 Creating favicon and icon files from existing image...\n');
      
      // Create favicon.svg (simple text-based)
      const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#DC2626"/>
  <text x="50" y="60" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">DG</text>
</svg>`;
      fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
      console.log('✅ Created favicon.svg (placeholder with "DG" text)');

      // Create various sizes of PNG icons from the base image
      const iconSizes = [
        { size: 16, name: 'favicon-16x16.png' },
        { size: 32, name: 'favicon-32x32.png' },
        { size: 180, name: 'apple-touch-icon.png' },
        { size: 192, name: 'android-chrome-192x192.png' },
        { size: 512, name: 'android-chrome-512x512.png' }
      ];

      for (const icon of iconSizes) {
        await sharp(baseImagePath)
          .resize(icon.size, icon.size, { fit: 'cover' })
          .png()
          .toFile(path.join(publicDir, icon.name));
        console.log(`✅ Created ${icon.name} (${icon.size}x${icon.size})`);
      }

      // Create Open Graph image (1200x630) for social sharing
      await sharp(baseImagePath)
        .resize(1200, 630, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toFile(path.join(publicDir, 'og-image.jpg'));
      console.log('✅ Created og-image.jpg (1200x630 for social sharing)');

      // Create logo.png for structured data
      await sharp(baseImagePath)
        .resize(400, 400, { fit: 'cover' })
        .png()
        .toFile(path.join(publicDir, 'logo.png'));
      console.log('✅ Created logo.png (400x400 for structured data)');

    } else {
      console.log('❌ Base image not found. Cannot create icons.');
    }

    console.log('\n🎉 Image optimization complete!');
    console.log('\n📝 Note: The generated icons are temporary placeholders.');
    console.log('   When you get the actual logo from the podcast owner,');
    console.log('   replace these files with proper branded versions.');

  } catch (error) {
    console.error('❌ Error optimizing images:', error);
  }
}

optimizeImages();
