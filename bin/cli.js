#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-o, --out <directory>', 'Specify the output directory')
  .parse(process.argv);

const sourceFilePath = path.join(__dirname, '../public', 'sw.js');
const destinationDirectory = program.out || 'public';
const destinationFilePath = path.join(destinationDirectory, 'sw.js');

// 复制文件
fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
  if (err) {
    console.error('Failed to copy file:', err);
    process.exit(1);
  }

  console.log('File copied successfully!');
});
