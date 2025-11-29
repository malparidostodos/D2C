import json
import codecs

# Remove BOM and load ES translations
with codecs.open('legal-translations-es-clean.json', 'r', 'utf-8-sig') as f:
    legal_es = json.load(f)

with codecs.open('src/locales/es/translation.json', 'r', 'utf-8-sig') as f:
    es_translation = json.load(f)

# Add legal section
es_translation['legal'] = legal_es['legal']

# Write back
with codecs.open('src/locales/es/translation.json', 'w', 'utf-8') as f:
    json.dump(es_translation, f, ensure_ascii=False, indent=4)

print('✅ Spanish translations updated')
