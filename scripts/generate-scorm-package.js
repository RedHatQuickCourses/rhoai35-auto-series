const path = require('path');
const fs = require('fs');
const scopackager = require('simple-scorm-packager');

const ANTORA_CONFIG_PATH = path.join(__dirname, '..', 'antora.yml');
const antoraRaw = fs.readFileSync(ANTORA_CONFIG_PATH, 'utf8');

const nameMatch = antoraRaw.match(/^name:\s*(.+)$/m);
const titleMatch = antoraRaw.match(/^title:\s*(.+)$/m);
const versionMatch = antoraRaw.match(/^version:\s*(.+)$/m);

if (!nameMatch || !titleMatch || !versionMatch) {
  console.error('antora.yml missing required fields: name, title, version');
  process.exit(1);
}

const componentName = nameMatch[1].trim();
const courseTitle = titleMatch[1].trim();
const componentVersion = versionMatch[1].trim();

const sourceDir = path.join(__dirname, '..', 'build', 'site');
const outputDir = path.join(__dirname, '..', 'build');

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  console.error('Run "npm run build" first to generate the Antora site.');
  process.exit(1);
}

const wrapperSrc = path.join(__dirname, '..', 'scorm', 'scorm-wrapper.html');
const wrapperDest = path.join(sourceDir, 'scorm-wrapper.html');
fs.copyFileSync(wrapperSrc, wrapperDest);
console.log('Copied scorm-wrapper.html into build/site/');

const config = {
  version: '1.2',
  organization: '',
  title: courseTitle,
  language: 'en',
  masteryScore: 80,
  startingPage: 'scorm-wrapper.html',
  source: sourceDir,
  package: {
    zip: true,
    outputFolder: outputDir,
    name: componentName,
    author: '',
    version: '1.0.0',
    description: courseTitle,
  },
};

scopackager(config, function (msg) {
  console.log(msg);
});
