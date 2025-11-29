import json
import codecs

# Load existing ES translation
with codecs.open('src/locales/es/translation.json', 'r', 'utf-8-sig') as f:
    es_translation = json.load(f)

# Load additions
with codecs.open('legal-additions-es.json', 'r', 'utf-8-sig') as f:
    additions = json.load(f)

# Add privacy, terms, and disclaimers to existing legal section
es_translation['legal']['privacy'] = additions['privacy']
es_translation['legal']['terms'] = additions['terms']
es_translation['legal']['disclaimers'] = additions['disclaimers']

# Write back
with codecs.open('src/locales/es/translation.json', 'w', 'utf-8') as f:
    json.dump(es_translation, f, ensure_ascii=False, indent=4)

print('✅ Spanish translations updated (Privacy, Terms, Disclaimers)')
