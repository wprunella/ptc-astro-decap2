// Debug script to check configuration issues
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking project configuration...\n');

// Check if admin.html exists
const adminPath = './public/admin/index.html';
if (fs.existsSync(adminPath)) {
  console.log('✅ admin/index.html exists');
} else {
  console.log('❌ admin/index.html missing');
}

// Check if config.yml exists
const configPath = './public/admin/config.yml';
if (fs.existsSync(configPath)) {
  console.log('✅ admin/config.yml exists');
  const configContent = fs.readFileSync(configPath, 'utf8');
  console.log('📋 Config content length:', configContent.length);
} else {
  console.log('❌ admin/config.yml missing');
}

// Check package.json dependencies
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
console.log('📦 Package dependencies:', Object.keys(packageJson.dependencies));
console.log('🔧 Package devDependencies:', Object.keys(packageJson.devDependencies));

// Check Astro config
const astroConfigPath = './astro.config.mjs';
if (fs.existsSync(astroConfigPath)) {
  console.log('✅ astro.config.mjs exists');
} else {
  console.log('❌ astro.config.mjs missing');
}

// Check content collections
const contentConfigPath = './src/content/config.ts';
if (fs.existsSync(contentConfigPath)) {
  console.log('✅ src/content/config.ts exists');
} else {
  console.log('❌ src/content/config.ts missing');
}

console.log('\n🎯 Running Astro dev server check...');
