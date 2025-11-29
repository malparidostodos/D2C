const fs = require('fs');
const path = require('path');

// Leer archivos
const esTranslationPath = path.join(__dirname, 'src', 'locales', 'es', 'translation.json');
const legalEsPath = path.join(__dirname, 'legal-translations-es-clean.json');

const esTranslation = JSON.parse(fs.readFileSync(esTranslationPath, 'utf8'));
const legalEs = JSON.parse(fs.readFileSync(legalEsPath, 'utf8'));

// Agregar legal section
esTranslation.legal = legalEs.legal;

// Escribir de vuelta
fs.writeFileSync(esTranslationPath, JSON.stringify(esTranslation, null, 4), 'utf8');

console.log('✅ Spanish translations updated successfully');
