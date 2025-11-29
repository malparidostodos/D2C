import json
import io

# Leer archivo existente con codificación UTF-8
with io.open('src/locales/en/translation.json', 'r', encoding='utf-8') as f:
    en_translation = json.load(f)

# Leer traducciones de cookie policy (con BOM)
with io.open('legal-translations-en-clean.json', 'r', encoding='utf-8-sig') as f:
    legal_cookie = json.load(f)

# Leer adiciones (privacy, terms, disclaimers) (con BOM)
with io.open('legal-additions-en.json', 'r', encoding='utf-8-sig') as f:
    legal_additions = json.load(f)

# Combinar todo
en_translation['legal'] = legal_cookie['legal']
en_translation['legal']['privacy'] = legal_additions['privacy']
en_translation['legal']['terms'] = legal_additions['terms']
en_translation['legal']['disclaimers'] = legal_additions['disclaimers']

# Escribir con codificación UTF-8 SIN BOM
with io.open('src/locales/en/translation.json', 'w', encoding='utf-8') as f:
    json.dump(en_translation, f, ensure_ascii=False, indent=4)

print('✅ Archivo inglés actualizado con codificación UTF-8 correcta')
