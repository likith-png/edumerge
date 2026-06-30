const fs = require('fs');
const path = require('path');

const srcDir = '/Users/likithv/Documents/DEMV3/scratch_unpack_new';
const destFile = '/Users/likithv/Documents/DEMV3/client/src/pages/IrisAI.tsx';

console.log('Generating IrisAI.tsx from new assets...');

// 1. Load styles from template.html
const templateHtml = fs.readFileSync(path.join(srcDir, 'template.html'), 'utf8');
const styleBlocks = templateHtml.match(/<style>([\s\S]*?)<\/style>/g);
if (!styleBlocks || styleBlocks.length < 2) {
  console.error('Expected at least two style blocks in template.html!');
  process.exit(1);
}
// The second style block contains the actual layout styles
const rawStyles = styleBlocks[1].replace(/<\/?style>/g, '').trim();

// Add Google Fonts import and namespace all body/html references or wrap them
const googleFontsImport = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');`;
let customStyles = `${googleFontsImport}\n\n${rawStyles}`;

// 2. Load JS files
const dataJs = fs.readFileSync(path.join(srcDir, 'd015d531-6b9c-4960-8ee8-16e5cb4da9c5.bin'), 'utf8');
const tweaksPanelJs = fs.readFileSync(path.join(srcDir, '69f5aa97-7236-4df6-bef5-c948cd1f8bdc.bin'), 'utf8');
const componentsJs = fs.readFileSync(path.join(srcDir, '267853d5-c720-4edd-973d-8a8fd29e4066.bin'), 'utf8');
const viewsJs = fs.readFileSync(path.join(srcDir, 'c3a393f7-b89d-4041-9a4f-98694be775dd.bin'), 'utf8');
const appJs = fs.readFileSync(path.join(srcDir, '10b73bea-746a-4719-9e08-8842dea5e538.bin'), 'utf8');

// Strip global assignments (window.COPILOT, Object.assign, etc.) and convert to react imports
function cleanCode(code, name) {
  let cleaned = code;
  // Remove ds-adherence-ignore comments
  cleaned = cleaned.replace(/\/\/ @ds-adherence-ignore.*/g, '');
  // Remove Object.assign(window, ...)
  cleaned = cleaned.replace(/Object\.assign\(window,\s*\{[\s\S]*?\}\);?/g, '');
  // Remove IIFE wrapped elements if any
  cleaned = cleaned.replace(/\(function\s*\(\)\s*\{/g, '');
  cleaned = cleaned.replace(/\}\)\(\);?\s*$/g, '');
  
  if (name === 'appJs') {
    // Comment out ReactDOM render logic safely
    cleaned = cleaned.replace('const __MODE = (typeof window !== "undefined" && window.__EXPERIENCE) || "showroom";', '');
    cleaned = cleaned.replace('const Root = __MODE === "mobile" ? MobileStage : __MODE === "web" ? WebStage : App;', '');
    cleaned = cleaned.replace('ReactDOM.createRoot(document.getElementById("root")).render(<Root />);', '// Stripped offline React DOM mount');
  }
  // Strip duplicate destructurings of React hooks
  cleaned = cleaned.replace(/const\s+\{\s*useState,\s*useRef,\s*useEffect,\s*useCallback\s*\}\s*=\s*React;?/g, '');
  cleaned = cleaned.replace(/window\.COPILOT\s*=/g, 'const COPILOT =');
  cleaned = cleaned.replace(/window\.COPILOT/g, 'COPILOT');
  cleaned = cleaned.replace(/window\.PROJECTS/g, 'PROJECTS');
  cleaned = cleaned.replace(/window\.PROJECT_TEMPLATES/g, 'PROJECT_TEMPLATES');
  cleaned = cleaned.replace(/window\.ARTIFACTS/g, 'ARTIFACTS');
  return cleaned.trim();
}

const cleanedDataJs = cleanCode(dataJs, 'dataJs');
const cleanedTweaksPanelJs = cleanCode(tweaksPanelJs, 'tweaksPanelJs');
const cleanedComponentsJs = cleanCode(componentsJs, 'componentsJs');
const cleanedViewsJs = cleanCode(viewsJs, 'viewsJs');
const cleanedAppJs = cleanCode(appJs, 'appJs');

const styleTagText = `
  .iris-container {
    /* Scoped styles wrapper */
  }
  ${customStyles}
`;

let finalAppJs = cleanedAppJs;
// Inject useNavigate into WebSidebar
finalAppJs = finalAppJs.replace(
  'function WebSidebar({ folded, onToggle, nav, chat, onNewChat, onSettings }) {',
  'function WebSidebar({ folded, onToggle, nav, chat, onNewChat, onSettings }) {\n  const navigate = useNavigate();'
);
// Replace the logout Icon with an interactive navigate back button
finalAppJs = finalAppJs.replace(
  '<Icon name="logout" size={17} style={{ color: "var(--ink-3)" }} />',
  '<button onClick={() => navigate("/")} className="icon-btn" title="Exit to HRMS Dashboard" style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer" }}><Icon name="logout" size={17} style={{ color: "var(--ink-3)" }} /></button>'
);

const fileContent = `// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   STYLE TOKENS & SCALAR VALUES (Scoped to .iris-container)
   ========================================================================== */

/* ==========================================================================
   INTERACTIVE DATA & CONVERSATION MATRIX
   ========================================================================== */
${cleanedDataJs}

/* ==========================================================================
   TWEAKS PANEL COMPONENT
   ========================================================================== */
${cleanedTweaksPanelJs}

/* ==========================================================================
   SHARED UI & ICON UTILITIES
   ========================================================================== */
${cleanedComponentsJs}

/* ==========================================================================
   PROJECTS & REFRESHABLE DASHBOARD VIEWS
   ========================================================================== */
${cleanedViewsJs}

/* ==========================================================================
   CHAT ENGINE & variant SCENE WRAPPERS
   ========================================================================== */
${finalAppJs}

export default function IrisAI() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom theme variables reactive to tweaks panel state
  const [t, setTweak] = useApplyTweaks();
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const acc = ACCENTS[t.accent] || ACCENTS["#000098"];
    el.style.setProperty("--accent", t.accent);
    el.style.setProperty("--accent-deep", acc.deep);
    el.style.setProperty("--accent-soft", t.dark ? acc.softDark : acc.soft);
    el.style.setProperty("--bubble-radius", t.corners + "px");
    el.style.setProperty("--card-radius", Math.max(8, t.corners - 2) + "px");
    el.style.setProperty("--font", FONTS[t.font] || FONTS.jakarta);
    el.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t]);

  return (
    <div ref={containerRef} className="iris-container w-full h-full relative">
      <style dangerouslySetInnerHTML={{ __html: ${JSON.stringify(styleTagText)} }} />
      <WebStage />
    </div>
  );
}
`;

fs.writeFileSync(destFile, fileContent);
console.log('IrisAI.tsx has been written successfully!');
