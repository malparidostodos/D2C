import json
import io

# Definir todas las traducciones legales directamente en el código
legal_es = {
    "legal": {
        "menu_title": "Legal",
        "on_this_page": "En Esta Página",
        "privacy_policy": "Política de Privacidad",
        "terms_conditions": "Términos y Condiciones",
        "cookie_policy": "Política de Cookies",
        "disclaimers": "Descargos de Responsabilidad",
        "cookie": {
            "subtitle": "Esta política explica cómo nuestro sitio web usa cookies y tecnologías similares para garantizar la funcionalidad adecuada, mejorar la experiencia del usuario y respaldar nuestros procesos de servicio.",
            "intro_title": "Introducción",
            "intro_text": "Bienvenido a la Política de Cookies de Ta' To' Clean. Esta política explica cómo nuestro sitio web utiliza cookies y tecnologías similares para garantizar el correcto funcionamiento, mejorar la experiencia del usuario y respaldar nuestros procesos de servicio, incluida la gestión de reservas, la interacción con los clientes y el análisis. Esta Política de Cookies debe leerse junto con nuestra Política de Privacidad y Términos y Condiciones.",
            "important_title": "Información Importante",
            "important_purpose_subtitle": "1.1 Propósito de esta Política de Cookies",
            "important_purpose_text": "Esta Política de Cookies explica: Qué son las cookies. Qué tipos de cookies utilizamos. Por qué las utilizamos. Cómo los usuarios pueden administrar, deshabilitar o eliminar cookies. Qué terceros pueden establecer cookies a través de nuestro sitio web.",
            "important_controller_subtitle": "1.2 Responsable",
            "important_controller_text": "Ta' To' Clean es responsable del procesamiento de datos asociados con las cookies utilizadas en nuestro sitio web.",
            "what_are_title": "¿Qué son las Cookies?",
            "what_are_text": "Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando visitas nuestro sitio web. Nos permiten reconocer tu navegador, recordar preferencias, respaldar procesos técnicos como reservas de citas y mejorar el rendimiento. Las cookies pueden ser: Cookies de sesión: eliminadas una vez que se cierra el navegador. Cookies persistentes: permanecen en tu dispositivo por un período definido. De primera parte: establecidas por Ta' To' Clean. De terceros: establecidas por proveedores de servicios externos.",
            "types_title": "Tipos de Cookies que Usamos",
            "types_necessary_subtitle": "3.1 Cookies Estrictamente Necesarias",
            "types_necessary_text": "Estas cookies son esenciales para el funcionamiento del sitio web y para habilitar servicios como: Completar reservas de citas. Almacenamiento temporal de información de reserva (nombre, correo electrónico, teléfono, fecha preferida y placa del vehículo). Seguridad del sitio web y prevención de fraude. Funcionalidad técnica. Estas cookies no se pueden deshabilitar.",
            "types_functional_subtitle": "3.2 Cookies Funcionales / de Preferencias",
            "types_functional_text": "Se utilizan para mejorar la experiencia del usuario al recordar: Configuración de idioma. Preferencias básicas de página. Retención opcional de datos del formulario.",
            "types_analytical_subtitle": "3.3 Cookies Analíticas y de Rendimiento",
            "types_analytical_text": "Se utilizan para evaluar: Cómo los usuarios interactúan con el proceso de reserva. Secciones más visitadas del sitio web. Rendimiento del sitio web, tasas de rebote y errores. Los análisis de terceros pueden incluir: Google Analytics, Meta Pixel, Herramientas de monitoreo del proveedor de alojamiento. Estas requieren consentimiento del usuario.",
            "types_marketing_subtitle": "3.4 Cookies de Marketing y Seguimiento (si aplica)",
            "types_marketing_text": "Se utilizan para: Medir la efectividad de la publicidad. Realizar campañas de remarketing. Construir perfiles de intereses anónimos. Estas requieren consentimiento explícito.",
            "info_collected_title": "Información Recopilada a través de Cookies",
            "info_collected_text": "Dependiendo del tipo de cookie, pueden recopilar: Dirección IP, Características del dispositivo, Tipo de navegador, Identificadores de sesión, Pasos del proceso de reserva, Interacciones de clics del usuario, Fecha y hora de las visitas. Las cookies no almacenan datos personales sin procesar (nombre, correo electrónico, teléfono o placa de matrícula), pero pueden interactuar con sistemas donde dichos datos se envían de forma segura.",
            "managing_title": "Gestión de Cookies",
            "managing_text": "Los usuarios pueden configurar, aceptar o rechazar cookies (excepto las cookies necesarias) a través del banner de cookies y de la configuración del navegador. Limitar las cookies puede afectar la funcionalidad de reserva.",
            "updates_title": "Actualizaciones de esta Política de Cookies",
            "updates_text": "Ta' To' Clean puede actualizar esta política en cualquier momento. La fecha de 'Última actualización' reflejará los cambios."
        },
        "privacy": {
            "subtitle": "Ta' To' Clean está comprometido a salvaguardar tus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información.",
            "intro_title": "Introducción",
            "intro_text": "Ta' To' Clean está comprometido a salvaguardar tus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información cuando accedes a nuestro sitio web, programas servicios o interactúas con nosotros. Esta política cumple con la ley colombiana de protección de datos (Ley 1581 de 2012, Decreto 1377 de 2013).",
            "collection_title": "Información que Recopilamos",
            "collection_text": "Recopilamos información que nos proporcionas directamente cuando: Creas una cuenta. Reservas un servicio. Te comunicas con nosotros para soporte.",
            "collection_personal_subtitle": "1.1 Información Personal",
            "collection_personal_text": "Nombre completo, Correo electrónico, Número de teléfono, Dirección (cuando se requiera para servicios a domicilio).",
            "collection_vehicle_subtitle": "1.2 Información del Vehículo",
            "collection_vehicle_text": "Placa del vehículo, Marca y modelo (opcional), Apodo asignado por el usuario.",
            "collection_technical_subtitle": "1.3 Información Técnica",
            "collection_technical_text": "Dirección IP, Tipo de navegador, Datos de cookies (consulta nuestra Política de Cookies).",
            "use_title": "Cómo Usamos Tu Información",
            "use_text": "Utilizamos tu información para: Procesar reservas y gestionar citas. Comunicarnos contigo sobre tus servicios. Mejorar nuestros servicios y experiencia de usuario. Enviar actualizaciones promocionales (con tu consentimiento). Cumplir con obligaciones legales.",
            "storage_title": "Almacenamiento y Retención de Datos",
            "storage_text": "Tus datos se almacenan en Supabase (proveedor de base de datos seguro) con servidores ubicados en la nube. Retenemos tus datos mientras mantengas una cuenta activa o según sea necesario para proporcionar servicios. Puedes solicitar la eliminación de datos en cualquier momento.",
            "sharing_title": "Compartir Datos",
            "sharing_text": "No vendemos, intercambiamos ni transferimos tu información personal a terceros, excepto: Proveedores de servicios (por ejemplo, Supabase para almacenamiento). Cuando lo requiera la ley. Con tu consentimiento explícito.",
            "rights_title": "Tus Derechos",
            "rights_text": "Tienes derecho a: Acceder a tus datos personales. Corregir información inexacta. Solicitar la eliminación de tus datos. Revocar el consentimiento para el procesamiento de datos. Puedes gestionar tu información a través del panel de tu cuenta.",
            "cookies_title": "Cookies y Seguimiento",
            "cookies_text": "Consulta nuestra Política de Cookies para obtener información detallada sobre cómo utilizamos cookies y tecnologías similares.",
            "security_title": "Medidas de Seguridad",
            "security_text": "Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o daño. Sin embargo, ningún sistema es 100% seguro.",
            "minors_title": "Menores de Edad",
            "minors_text": "Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos knowingly información de menores.",
            "updates_title": "Actualizaciones de esta Política",
            "updates_text": "Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.",
            "contact_title": "Información de Contacto",
            "contact_text": "Para preguntas sobre privacidad o solicitudes de datos, contáctanos en: Correo electrónico: privacy@tatotoclean.com"
        },
        "terms": {
            "subtitle": "Por favor revisa nuestros términos y condiciones para comprender completamente cómo manejamos tus interacciones con este sitio web.",
            "intro_title": "Introducción",
            "intro_text": "Estos Términos y Condiciones gobiernan el uso del sitio web de Ta' To' Clean, la plataforma de reservas y los servicios. Al utilizar nuestro sitio web, aceptas estos Términos.",
            "services_title": "Servicios Proporcionados",
            "services_text": "Ta' To' Clean proporciona servicios de detailing automotriz y limpieza. Nos reservamos el derecho de rechazar el servicio a cualquier persona por cualquier motivo en cualquier momento.",
            "booking_title": "Reservas y Pagos",
            "booking_text": "Las reservas están sujetas a disponibilidad. Los precios de nuestros servicios están sujetos a cambios sin previo aviso.",
            "booking_process_subtitle": "3.1 Proceso de Reserva",
            "booking_process_text": "Las reservas se realizan a través de nuestro sitio web. Debes proporcionar información precisa del vehículo y de contacto. Recibirás un correo electrónico de confirmación una vez completada la reserva.",
            "booking_payment_subtitle": "3.2 Política de Pago",
            "booking_payment_text": "El pago se procesa al momento del servicio. Aceptamos múltiples métodos de pago. Los precios incluyen impuestos aplicables.",
            "accounts_title": "Cuentas de Usuario",
            "accounts_text": "Eres responsable de mantener la confidencialidad de tu cuenta. No debes compartir tus credenciales de acceso. Nos reservamos el derecho de suspender o terminar cuentas que violen estos Términos.",
            "liability_title": "Limitación de Responsabilidad",
            "liability_text": "Ta' To' Clean no será responsable de daños indirectos, incidentales, especiales, consecuenciales o punitivos, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.",
            "cancellation_title": "Política de Cancelación",
            "cancellation_text": "Puedes cancelar tu reserva hasta 24 horas antes del horario programado para un reembolso completo. Las cancelaciones tardías pueden estar sujetas a una tarifa.",
            "ip_title": "Propiedad Intelectual",
            "ip_text": "Todo el contenido de este sitio web (texto, gráficos, logos) es propiedad de Ta' To' Clean y está protegido por leyes de propiedad intelectual. No puedes usar nuestro contenido sin permiso explícito.",
            "changes_title": "Cambios a los Términos",
            "changes_text": "Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Los cambios significativos entrarán en vigor 30 días después de la publicación."
        },
        "disclaimers": {
            "subtitle": "La información proporcionada por Ta' To' Clean en nuestro sitio web es solo para fines informativos generales.",
            "service_title": "Descargo de Responsabilidad sobre Resultados del Servicio",
            "service_text": "Los resultados del detailing varían dependiendo de: Condición previa del vehículo. Deterioro de la superficie. Condiciones ambientales. No se garantiza una corrección del 100% de los defectos.",
            "vehicle_title": "Condición del Vehículo",
            "vehicle_text": "Aunque tomamos todas las precauciones para garantizar la seguridad de tu vehículo mientras está bajo nuestro cuidado, no somos responsables de pérdidas o daños debidos a robo, incendio o desastres naturales más allá de nuestro control. No somos responsables de daños preexistentes.",
            "links_title": "Descargo de Responsabilidad de Enlaces Externos",
            "links_text": "El sitio puede contener enlaces a otros sitios web o contenido que pertenece o se origina de terceros. Dichos enlaces externos no son investigados, monitoreados o verificados por nosotros en cuanto a precisión, adecuación, validez, confiabilidad, disponibilidad o completitud.",
            "advice_title": "Asesoramiento Profesional",
            "advice_text": "La información en nuestro sitio web es solo para fines informáticos generales. No debe considerarse como asesoramiento profesional. Siempre busca el consejo de un profesional calificado con cualquier pregunta que puedas tener."
        }
    }
}

# Leer archivo existente
with io.open('src/locales/es/translation.json', 'r', encoding='utf-8') as f:
    es_translation = json.load(f)

# Agregar traducciones legales
es_translation['legal'] = legal_es['legal']

# Escribir con UTF-8 sin BOM
with io.open('src/locales/es/translation.json', 'w', encoding='utf-8') as f:
    json.dump(es_translation, f, ensure_ascii=False, indent=4)

print('✅ Traducciones españolas actualizadas correctamente')
