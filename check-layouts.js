const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'client/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
const noLayout = [];
files.forEach(f => {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  if (!content.includes('<Layout')) {
    noLayout.push(f);
  }
});
console.log('Files missing Layout:', noLayout.map(n => '- ' + n).join('\n'));
