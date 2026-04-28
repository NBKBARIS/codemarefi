
const fs = require('fs');
const content = fs.readFileSync('app/globals.css', 'utf8');
const selectors = {};
let currentMedia = 'root';

// Simple parser to track media queries and selectors
const lines = content.split('\n');
lines.forEach((line, i) => {
    const mediaMatch = line.match(/@media\s*\(.*?\)\s*\{/);
    if (mediaMatch) {
        currentMedia = line.trim();
    }
    if (line.includes('}') && !line.includes('{')) {
        currentMedia = 'root';
    }

    const selectorMatch = line.match(/^(\.[a-zA-Z0-9_-]+)\s*\{/);
    if (selectorMatch) {
        const selector = selectorMatch[1];
        const key = `${currentMedia} > ${selector}`;
        if (!selectors[key]) selectors[key] = [];
        selectors[key].push(i + 1);
    }
});

for (const key in selectors) {
    if (selectors[key].length > 1) {
        console.log(`DUPE: ${key} at lines ${selectors[key].join(', ')}`);
    }
}
