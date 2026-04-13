const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'log.txt');
function log(msg) {
  fs.appendFileSync(logFile, msg + '\n');
}

try {
  const srcDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\0056983c-c258-4bfb-8c10-179ed754698c';
  const destDir = path.join(__dirname, 'public', 'images', 'cars');

  log('Starting copy script...');
  if (!fs.existsSync(path.join(__dirname, 'public', 'images'))) {
    fs.mkdirSync(path.join(__dirname, 'public', 'images'), { recursive: true });
    log('Created public/images');
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    log('Created ' + destDir);
  }

  const filesToCopy = [
    { srcName: 'toyota_avanza_1775807002684.png', destName: 'toyota_avanza.png' },
    { srcName: 'honda_brio_1775807018260.png', destName: 'honda_brio.png' },
    { srcName: 'suzuki_ertiga_1775807036319.png', destName: 'suzuki_ertiga.png' },
    { srcName: 'toyota_innova_zenix_1775807055535.png', destName: 'toyota_innova_zenix.png' },
    { srcName: 'honda_crv_1775807079262.png', destName: 'honda_crv.png' },
    { srcName: 'mitsubishi_pajero_sport_1775807107602.png', destName: 'mitsubishi_pajero_sport.png' },
    { srcName: 'toyota_alphard_1775807127591.png', destName: 'toyota_alphard.png' },
    { srcName: 'lexus_lm_1775807146468.png', destName: 'lexus_lm.png' },
    { srcName: 'mercedes_s_class_1775807162769.png', destName: 'mercedes_s_class.png' },
    { srcName: 'bmw_7_series_1775807177351.png', destName: 'bmw_7_series.png' }
  ];

  filesToCopy.forEach(file => {
    const srcPath = path.join(srcDir, file.srcName);
    const destPath = path.join(destDir, file.destName);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      log(`Copied ${file.srcName} to ${file.destName}`);
    } else {
      log(`Source file not found: ${srcPath}`);
    }
  });

  log('Copy complete!');
} catch (e) {
  log('ERROR: ' + e.message);
}
