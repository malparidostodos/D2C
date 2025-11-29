import json
import codecs

# Load existing EN translation
with codecs.open('src/locales/en/translation.json', 'r', 'utf-8-sig') as f:
    en_translation = json.load(f)

# Load additions
with codecs.open('legal-additions-en.json', 'r', 'utf-8-sig') as f:
    additions = json.load(f)

# Add privacy, terms, and disclaimers to existing legal section
en_translation['legal']['privacy'] = additions['privacy']
en_translation['legal']['terms'] = additions['terms']
en_translation['legal']['disclaimers'] = additions['disclaimers']

# Write back
with codecs.open('src/locales/en/translation.json', 'w', 'utf-8') as f:
    json.dump(en_translation, f, ensure_ascii=False, indent=4)

print('✅ English translations updated (Privacy, Terms, Disclaimers)')
