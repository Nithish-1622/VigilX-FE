const fs = require('fs');

let content = fs.readFileSync('src/pages/Home/HotspotMap.jsx', 'utf8');

content = content.replace(/background: '#04060A'/g, 'background: \'var(--bg-canvas)\'');
content = content.replace(/background: '#070A10'/g, 'background: \'var(--bg-panel)\'');
content = content.replace(/background: 'rgba\\(15, 23, 42, 0.8\\)'/g, 'background: \'var(--bg-row)\'');

content = content.replace(/color: '#FFFFFF'/g, 'color: \'var(--text-primary)\'');
content = content.replace(/color: '#94A3B8'/g, 'color: \'var(--text-secondary)\'');
content = content.replace(/color: '#64748B'/g, 'color: \'var(--text-tertiary)\'');
content = content.replace(/color: '#06080C'/g, 'color: \'var(--bg-panel)\''); // for circle fill inside marker svg
content = content.replace(/fill="#06080C"/g, 'fill="var(--bg-panel)"');

content = content.replace(/border: '1px solid rgba\\(255, 255, 255, 0.08\\)'/g, 'border: \'1px solid var(--border-base)\'');
content = content.replace(/borderBottom: '1px solid rgba\\(255, 255, 255, 0.08\\)'/g, 'borderBottom: \'1px solid var(--border-dim)\'');
content = content.replace(/borderBottom: '1px solid rgba\\(255, 255, 255, 0.06\\)'/g, 'borderBottom: \'1px solid var(--border-dim)\'');
content = content.replace(/border: '1px solid rgba\\(255, 255, 255, 0.12\\)'/g, 'border: \'1px solid var(--border-base)\'');

content = content.replace(/background: 'rgba\\(255, 255, 255, 0.05\\)'/g, 'background: \'var(--bg-raised)\'');
content = content.replace(/border: `1px solid \\$\\{isLiveTracking \\? '#00D4FF' : 'rgba\\(255, 255, 255, 0.2\\)'\\}`/g, 'border: `1px solid ${isLiveTracking ? \'#00D4FF\' : \'var(--border-base)\'}`');
content = content.replace(/borderColor: selectedDistrict === dist \\? '#00C8F0' : 'rgba\\(255, 255, 255, 0.08\\)'/g, 'borderColor: selectedDistrict === dist ? \'#00C8F0\' : \'var(--border-base)\'');

content = content.replace(/background: rgba\\(6, 8, 14, 0.94\\);/g, 'background: var(--bg-overlay);');
content = content.replace(/background: rgba\\(0, 30, 45, 0.95\\);/g, 'background: var(--bg-overlay);');

fs.writeFileSync('src/pages/Home/HotspotMap.jsx', content);
