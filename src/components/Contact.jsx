import React, { useState, useEffect, useRef } from 'react'

const Contact = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const validateEmail = (emailValue) => {
    if (!emailValue) {
      return 'Por favor, ingresa tu correo electrónico'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return 'Por favor, ingresa un correo electrónico válido'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Validar email
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      return
    }

    // Limpiar error y deshabilitar botón
    setError('')
    setIsSubmitting(true)

    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Newsletter subscription:', email)

    // Simular envío
    setTimeout(() => {
      alert('¡Gracias por suscribirte!')
      setEmail('')
      setIsSubmitting(false)
    }, 500)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('')
    }
  }

  // Cerrar el mensaje de error al hacer clic fuera del formulario
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) && error) {
        setError('')
      }
    }

    if (error) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [error])

  return (
    <section id="contacto" className="bg-white min-h-screen flex flex-col contact-section">
      <div
        className="contact-container"
        style={{
          paddingLeft: 'var(--base-padding-x)',
          paddingRight: 'var(--base-padding-x)',
          paddingTop: 'calc(var(--vh, 1vh) * 50)',
          paddingBottom: 'var(--base-padding-y)',
        }}
      >
        <div className="contact-main-grid rounded-3xl p-8 md:p-12">
          {/* Información de contacto */}
          <div className="contact-info-container">
            <div className="contact-info-grid">
              {/* Dirección */}
              <div className="contact-address">
                <div className="contact-text">Carrera 15#57-11</div>
                <div className="contact-text">Dosquebradas, Risaralda</div>
                <div className="contact-text">Colombia</div>
              </div>

              {/* Redes sociales y Business */}
              <div className="contact-socials-business">
                <div className="contact-socials">
                  <a href="#" className="contact-link text-arrow-wrapper select-none">
                    <span className="text-arrow-icon-wrapper">
                      <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="text-arrow-text select-none">Twitter / X</span>
                  </a>
                  <a href="#" className="contact-link text-arrow-wrapper select-none">
                    <span className="text-arrow-icon-wrapper">
                      <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="text-arrow-text select-none">Instagram</span>
                  </a>
                  <a href="#" className="contact-link text-arrow-wrapper select-none">
                    <span className="text-arrow-icon-wrapper">
                      <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="text-arrow-text select-none">Linkedin</span>
                  </a>
                </div>
                <div className="contact-business">
                  <div className="contact-label select-none">Negocios</div>
                  <a href="mailto:business@dirty2clean.com" className="contact-link email-link">business@dirty2clean.com</a>
                </div>
                <div className="contact-enquires">
                  <div className="contact-label select-none">Consultas generales</div>
                  <a href="mailto:contacto@dirty2clean.com" className="contact-link email-link">contacto@dirty2clean.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="contact-newsletter">
            <h3 className="contact-newsletter-title select-none">
              Obtén ofertas y<br />
              servicios exclusivos
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="contact-newsletter-form" noValidate>
              <div className="contact-newsletter-input-wrapper">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`contact-newsletter-input ${error ? 'error' : ''}`}
                  placeholder="Tu correo"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="contact-newsletter-button"
                  aria-label="Send newsletter form button"
                  disabled={isSubmitting}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.9999 11.9998C1.9999 12.552 2.44762 12.9997 2.9999 12.9997H18.9757C18.8901 13.148 18.7838 13.2876 18.657 13.4144L12.2931 19.7784C11.9025 20.1689 11.9025 20.8021 12.2931 21.1926C12.6836 21.5831 13.3168 21.5831 13.7073 21.1926L22.1926 12.7073C22.5831 12.3168 22.5831 11.6836 22.1926 11.2931L22.1924 11.293L13.7071 2.80767C13.3166 2.41715 12.6834 2.41715 12.2929 2.80767C11.9024 3.1982 11.9024 3.83136 12.2929 4.22189L18.657 10.586C18.7836 10.7126 18.8896 10.8518 18.9752 10.9998H2.9999C2.44762 10.9997 1.9999 11.4475 1.9999 11.9998Z" fill="black" />
                  </svg>
                </button>
                {error && (
                  <div className="contact-newsletter-error">
                    <span className="error-icon">!</span>
                    <span className="error-message select-none">{error}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-copyright select-none">©2025 DIRTY2CLEAN</div>
          <a href="https://labs.dirty2clean.com" target="_blank" className="footer-bottom-labs select-none">R&D: labs.dirty2clean.com</a>
          <div className="footer-bottom-tagline select-none">Hecho por Johan & Cursor con <span className="text-red-500">❤️</span></div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-bottom-up"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ display: 'inline-block', position: 'relative', transform: 'translate3d(0, 0, 0)' }}>
              <path fill="#fff" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ position: 'absolute' }}>
              <path fill="#fff" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Contact

