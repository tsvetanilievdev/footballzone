#!/usr/bin/env node

/**
 * FootballZone.bg License Checker
 * Copyright (c) 2024 FootballZone.bg - All Rights Reserved
 * 
 * This script checks for proper license headers in source files.
 */

const fs = require('fs');
const path = require('path');

const LICENSE_HEADER = `/**
 * FootballZone.bg
 * Copyright (c) 2024 FootballZone.bg - All Rights Reserved
 * 
 * This software is proprietary and confidential.
 * No part of this software may be reproduced, distributed, or transmitted
 * without the prior written permission of the copyright holder.
 */`;

const REQUIRED_FILES = [
  'LICENSE',
  'COPYRIGHT.md',
  'README.md'
];

const SOURCE_DIRS = [
  'backend/src',
  'frontend/src'
];

const EXCLUDED_EXTENSIONS = [
  '.d.ts',
  '.map',
  '.min.js',
  '.min.css'
];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has license header
    if (content.includes('Copyright (c) 2024 FootballZone.bg')) {
      return { hasHeader: true, path: filePath };
    } else {
      return { hasHeader: false, path: filePath };
    }
  } catch (error) {
    return { hasHeader: false, path: filePath, error: error.message };
  }
}

function walkDir(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (!EXCLUDED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

function main() {
  console.log('🔍 Checking FootballZone.bg license compliance...\n');
  
  // Check required files
  console.log('📋 Checking required license files:');
  for (const file of REQUIRED_FILES) {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
    }
  }
  
  console.log('\n📁 Checking source files for license headers:');
  
  let totalFiles = 0;
  let filesWithHeaders = 0;
  let filesWithoutHeaders = [];
  
  for (const dir of SOURCE_DIRS) {
    if (fs.existsSync(dir)) {
      const files = walkDir(dir);
      
      for (const file of files) {
        totalFiles++;
        const result = checkFile(file);
        
        if (result.hasHeader) {
          filesWithHeaders++;
        } else {
          filesWithoutHeaders.push(file);
        }
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Total files checked: ${totalFiles}`);
  console.log(`  Files with headers: ${filesWithHeaders}`);
  console.log(`  Files without headers: ${filesWithoutHeaders.length}`);
  
  if (filesWithoutHeaders.length > 0) {
    console.log(`\n⚠️  Files missing license headers:`);
    filesWithoutHeaders.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log(`\n${filesWithoutHeaders.length === 0 ? '✅' : '⚠️'} License check completed.`);
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, walkDir };
