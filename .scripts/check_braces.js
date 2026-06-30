const fs = require('fs');
const path = require('path');

const srcDir = '/Users/likithv/Documents/DEMV3/scratch_unpack';

const files = [
  'cc5c61d5-3d72-420f-a47f-f9c3b2fd0140.bin',
  'ee19c307-69a3-4df7-a381-ed415953b50a.bin',
  'ae606a2a-4e8b-4507-8873-78536fdae0a6.bin',
  'abcf551c-83f6-4234-b30f-ae4bc603c556.bin',
  'aa7ef954-cf2c-4316-b420-8f96028616f6.bin'
];

function checkBalance(content, name) {
  let open = 0;
  let close = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') open++;
    else if (content[i] === '}') close++;
  }
  console.log(`${name}: { count = ${open}, } count = ${close}, balance = ${open - close}`);
}

for (const file of files) {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  checkBalance(content, file);
}
