// Check all content files for proper slug fields
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking content files for slug fields...\n');

// Check blog posts
const blogDir = './src/content/blog';
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir);
  console.log('📝 Blog posts found:', blogFiles);
  
  blogFiles.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const hasSlug = frontmatter.includes('slug:');
        console.log(`${file}: ${hasSlug ? '✅ Has slug' : '❌ Missing slug'}`);
        
        if (!hasSlug) {
          console.log('   Frontmatter content:', frontmatter);
        }
      }
    }
  });
} else {
  console.log('❌ Blog directory not found');
}

// Check services
const servicesDir = './src/content/services';
if (fs.existsSync(servicesDir)) {
  const serviceFiles = fs.readdirSync(servicesDir);
  console.log('\n🏋️ Services found:', serviceFiles);
  
  serviceFiles.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(servicesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const hasSlug = content.includes('slug:');
      console.log(`${file}: ${hasSlug ? '✅ Has slug' : '❌ Missing slug'}`);
    }
  });
}

// Check locations
const locationsDir = './src/content/locations';
if (fs.existsSync(locationsDir)) {
  const locationFiles = fs.readdirSync(locationsDir);
  console.log('\n📍 Locations found:', locationFiles);
  
  locationFiles.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(locationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const hasSlug = content.includes('slug:');
      console.log(`${file}: ${hasSlug ? '✅ Has slug' : '❌ Missing slug'}`);
    }
  });
}
