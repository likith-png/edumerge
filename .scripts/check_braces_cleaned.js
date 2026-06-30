const fs = require('fs');
const path = require('path');

const srcDir = '/Users/likithv/Documents/DEMV3/scratch_unpack';

const files = [
  { file: 'cc5c61d5-3d72-420f-a47f-f9c3b2fd0140.bin', name: 'dataJs' },
  { file: 'ee19c307-69a3-4df7-a381-ed415953b50a.bin', name: 'tweaksPanelJs' },
  { file: 'ae606a2a-4e8b-4507-8873-78536fdae0a6.bin', name: 'componentsJs' },
  { file: 'abcf551c-83f6-4234-b30f-ae4bc603c556.bin', name: 'viewsJs' },
  { file: 'aa7ef954-cf2c-4316-b420-8f96028616f6.bin', name: 'appJs' }
];

function cleanCode(code, name) {
  let cleaned = code;
  cleaned = cleaned.replace(/\/\/ @ds-adherence-ignore.*/g, '');
  cleaned = cleaned.replace(/Object\.assign\(window,\s*\{[\s\S]*?\}\);?/g, '');
  cleaned = cleaned.replace(/^\(function\s*\(\)\s*\{/g, '');
  cleaned = cleaned.replace(/\}\)\(\);?\s*$/g, '');
  cleaned = cleaned.replace(/window\.COPILOT/g, 'COPILOT');
  cleaned = cleaned.replace(/window\.PROJECTS/g, 'PROJECTS');
  cleaned = cleaned.replace(/window\.PROJECT_TEMPLATES/g, 'PROJECT_TEMPLATES');
  cleaned = cleaned.replace(/window\.ARTIFACTS/g, 'ARTIFACTS');
  
  if (name === 'appJs') {
    cleaned = cleaned.replace('const __MODE = (typeof window !== "undefined" && window.__EXPERIENCE) || "showroom";', '');
    cleaned = cleaned.replace('const Root = __MODE === "mobile" ? MobileStage : __MODE === "web" ? WebStage : App;', '');
    cleaned = cleaned.replace('ReactDOM.createRoot(document.getElementById("root")).render(<Root />);', '// Stripped offline React DOM mount');
  }
  return cleaned.trim();
}

function checkBalance(content, name) {
  let open = 0;
  let close = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') open++;
    else if (content[i] === '}') close++;
  }
  console.log(`${name}: { count = ${open}, } count = ${close}, balance = ${open - close}`);
}

for (const entry of files) {
  const content = fs.readFileSync(path.join(srcDir, entry.file), 'utf8');
  const cleaned = cleanCode(content, entry.name);
  checkBalance(cleaned, entry.name);
}

const totalContent = fs.readFileSync('/Users/likithv/Documents/DEMV3/client/src/pages/IrisAI.tsx', 'utf8');
checkBalance(totalContent, 'IrisAI.tsx');
