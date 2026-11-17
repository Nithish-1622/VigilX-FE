const fs = require('fs');

const path = 'src/pages/ToolsStudio/index.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replaceAll("'rgba(10, 14, 22, 0.92)'", "'var(--bg-panel)'");
content = content.replaceAll("'rgba(6, 8, 12, 0.85)'", "'var(--bg-row)'");
content = content.replaceAll("'rgba(6, 8, 12, 0.95)'", "'var(--bg-panel)'");
content = content.replaceAll("'rgba(255, 255, 255, 0.1)'", "'var(--border-base)'");
content = content.replaceAll("'rgba(255, 255, 255, 0.08)'", "'var(--border-dim)'");
content = content.replaceAll("'rgba(255, 255, 255, 0.06)'", "'var(--border-dim)'");
content = content.replaceAll("'rgba(255,255,255,0.02)'", "'var(--bg-raised)'");
content = content.replaceAll("'rgba(255,255,255,0.06)'", "'var(--border-dim)'");
content = content.replaceAll("'rgba(255,255,255,0.1)'", "'var(--border-base)'");
content = content.replaceAll("'rgba(255,255,255,0.08)'", "'var(--border-dim)'");
content = content.replaceAll("'rgba(255,255,255,0.03)'", "'var(--bg-raised)'");
content = content.replaceAll("'rgba(6, 8, 12, 0.4)'", "'var(--bg-row)'");
content = content.replaceAll("'#06080C'", "'var(--bg-canvas)'");

fs.writeFileSync(path, content);
console.log("Updated ToolsStudio index.jsx successfully.");
