const fs = require('fs');
const path = require('path');

// Leer archivos
const enTranslationPath = path.join(__dirname, 'src', 'locales', 'en', 'translation.json');
const legalEnPath = path.join(__dirname, 'legal-translations-en-clean.json');

const enTranslation = JSON.parse(fs.readFileSync(enTranslationPath, 'utf8'));
const legalEn = JSON.parse(fs.readFileSync(legalEnPath, 'utf8'));

// Agregar legal section
enTranslation.legal = legalEn.legal;

// Escribir de vuelta
fs.writeFileSync(enTranslationPath, JSON.stringify(enTranslation, null, 4), 'utf8');

console.log('✅ English translations updated successfully');
