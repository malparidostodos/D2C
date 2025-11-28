const fs = require('fs');
const path = require('path');

const files = [
    'src/locales/es/translation.json',
    'src/locales/en/translation.json'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        JSON.parse(content);
        console.log(`✅ ${file} is valid JSON`);
    } catch (error) {
        console.error(`❌ ${file} is INVALID JSON:`, error.message);
    }
});
