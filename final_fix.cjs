const fs = require('fs');
let content = fs.readFileSync('src/pages/ToolsStudio/index.jsx', 'utf8');

content = content.replaceAll("'#FFF'", "'var(--text-primary)'");
content = content.replaceAll("'#FFFFFF'", "'var(--text-primary)'");
content = content.replaceAll("'#06080C'", "'var(--bg-canvas)'");
content = content.replaceAll("'rgba(6, 8, 12, 0.85)'", "'var(--bg-row)'");
content = content.replaceAll("'rgba(6, 8, 12, 0.95)'", "'var(--bg-panel)'");
content = content.replaceAll("'rgba(0, 200, 240, 0.15)'", "'var(--bg-raised)'");

fs.writeFileSync('src/pages/ToolsStudio/index.jsx', content);
console.log('Fixed final colors');
