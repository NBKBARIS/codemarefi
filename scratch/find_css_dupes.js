
const fs = require('fs');
const content = fs.readFileSync('app/globals.css', 'utf8');
const lines = content.split('\n');
const selectors = {};
let currentSelector = null;

lines.forEach((line, index) => {
    const match = line.match(/^(\.[a-zA-Z0-9_-]+)\s*\{/);
    if (match) {
        const selector = match[1];
        if (!selectors[selector]) {
            selectors[selector] = [];
        }
        selectors[selector].push(index + 1);
    }
});

for (const selector in selectors) {
    if (selectors[selector].length > 1) {
        console.log(`Duplicate selector: ${selector} at lines ${selectors[selector].join(', ')}`);
    }
}
