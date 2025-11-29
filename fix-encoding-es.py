import json
import io

# Leer archivo existente con codificación UTF-8
with io.open('src/locales/es/translation.json', 'r', encoding='utf-8') as f:
    es_translation = json.load(f)

# Leer traducciones de cookie policy (con BOM)
with io.open('legal-translations-es-clean.json', 'r', encoding='utf-8-sig') as f:
    legal_cookie = json.load(f)

# Leer adiciones (privacy, terms, disclaimers) (con BOM)
with io.open('legal-additions-es.json', 'r', encoding='utf-8-sig') as f:
    legal_additions = json.load(f)

# Combinar todo
es_translation['legal'] = legal_cookie['legal']
es_translation['legal']['privacy'] = legal_additions['privacy']
es_translation['legal']['terms'] = legal_additions['terms']
es_translation['legal']['disclaimers'] = legal_additions['disclaimers']

# Escribir con codificación UTF-8 SIN BOM
with io.open('src/locales/es/translation.json', 'w', encoding='utf-8') as f:
    json.dump(es_translation, f, ensure_ascii=False, indent=4)

print('✅ Archivo español actualizado con codificación UTF-8 correcta')
