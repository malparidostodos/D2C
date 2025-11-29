import json
import codecs

# Remove BOM and load EN translations
with codecs.open('legal-translations-en-clean.json', 'r', 'utf-8-sig') as f:
    legal_en = json.load(f)

with codecs.open('src/locales/en/translation.json', 'r', 'utf-8-sig') as f:
    en_translation = json.load(f)

# Add legal section
en_translation['legal'] = legal_en['legal']

# Write back
with codecs.open('src/locales/en/translation.json', 'w', 'utf-8') as f:
    json.dump(en_translation, f, ensure_ascii=False, indent=4)

print('✅ English translations updated')
