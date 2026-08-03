const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

if (!content.includes('[data-theme="dark"] .maplibregl-canvas')) {
    content += '\n[data-theme="dark"] .maplibregl-canvas {\n  filter: brightness(0.25) saturate(0.2) contrast(1.2);\n}\n';
}

fs.writeFileSync('src/index.css', content);
console.log('CSS updated');
