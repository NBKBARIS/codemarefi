
const fs = require('fs');
const content = fs.readFileSync('app/globals.css', 'utf8');
const blocks = content.split('}');

blocks.forEach((block, blockIndex) => {
    const lines = block.split('\n');
    const properties = {};
    lines.forEach((line) => {
        const match = line.match(/^\s*([a-z-]+)\s*:/i);
        if (match) {
            const prop = match[1].toLowerCase();
            if (properties[prop]) {
                console.log(`Duplicate property "${prop}" in block starting near line ${blockIndex * 5} (approx)`);
            }
            properties[prop] = true;
        }
    });
});
