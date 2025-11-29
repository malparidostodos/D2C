import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Contact = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const validateEmail = (emailValue) => {
    if (!emailValue) {
      return t('contact_section.newsletter.error_empty')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return t('contact_section.newsletter.error_invalid')
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
      alert(t('contact_section.newsletter.success'))
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
                <div className="contact-text">{t('contact_section.address.line1')}</div>
                <div className="contact-text">{t('contact_section.address.line2')}</div>
                <div className="contact-text">{t('contact_section.address.country')}</div>
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
                  <div className="contact-label select-none">{t('contact_section.business')}</div>
                  <a href="mailto:business@tatotoclean.com" className="contact-link email-link">business@tatotoclean.com</a>
                </div>
                <div className="contact-enquires">
                  <div className="contact-label select-none">{t('contact_section.general_enquiries')}</div>
                  <a href="mailto:contacto@tatotoclean.com" className="contact-link email-link">contacto@tatotoclean.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="contact-newsletter">
            <h3 className="contact-newsletter-title select-none">
              {t('contact_section.newsletter.title').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="contact-newsletter-form" noValidate>
              <div className="contact-newsletter-input-wrapper">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`contact-newsletter-input ${error ? 'error' : ''}`}
                  placeholder={t('contact_section.newsletter.placeholder')}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="contact-newsletter-button"
                  aria-label={t('contact_section.newsletter.aria_label')}
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
          {/* Footer Columns */}
          <div className="footer-columns">
            {/* Comienza / Get Started */}
            <div className="footer-column">
              <h3 className="footer-column-title">{t('contact_section.footer.get_started.title')}</h3>
              <ul className="footer-links">
                <li><Link to="/booking">{t('contact_section.footer.get_started.book_service')}</Link></li>
                <li><Link to="/signup">{t('contact_section.footer.get_started.create_account')}</Link></li>
                <li><Link to="/login">{t('contact_section.footer.get_started.login')}</Link></li>
              </ul>
            </div>

            {/* Servicios / Services */}
            <div className="footer-column">
              <h3 className="footer-column-title">{t('contact_section.footer.services.title')}</h3>
              <ul className="footer-links">
                <li><a href="#basic">{t('contact_section.footer.services.basic_wash')}</a></li>
                <li><a href="#premium">{t('contact_section.footer.services.premium_wash')}</a></li>
                <li><a href="#ceramic">{t('contact_section.footer.services.ceramic_coating')}</a></li>
                <li><a href="#correction">{t('contact_section.footer.services.paint_correction')}</a></li>
                <li><a href="#interior">{t('contact_section.footer.services.interior_detailing')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-column">
              <h3 className="footer-column-title">{t('contact_section.footer.legal.title')}</h3>
              <ul className="footer-links">
                <li><Link to="/cookie-policy">{t('legal.cookie_policy')}</Link></li>
                <li><Link to="/privacy-policy">{t('legal.privacy_policy')}</Link></li>
                <li><Link to="/terms-conditions">{t('legal.terms_conditions')}</Link></li>
                <li><Link to="/disclaimers">{t('contact_section.footer.disclaimers_link')}</Link></li>
              </ul>
            </div>

            {/* Ayuda / Help */}
            <div className="footer-column">
              <h3 className="footer-column-title">{t('contact_section.footer.help.title')}</h3>
              <ul className="footer-links">
                <li><a href="#faq">{t('contact_section.footer.help.faq')}</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom - Copyright, Labs, Made by */}
          <div className="footer-bottom-row">
            <div className="footer-bottom-copyright">{t('contact_section.footer.bottom.copyright')}</div>
            <a href="https://labs.tatotoclean.com" target="_blank" rel="noopener noreferrer" className="footer-bottom-labs">
              {t('contact_section.footer.bottom.labs')}
            </a>
            <div className="footer-bottom-tagline">
              {t('contact_section.footer.bottom.made_by')} <span className="text-red-500">❤️</span>
            </div>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-bottom-up"
            aria-label={t('contact_section.footer.bottom.aria_label_scroll')}
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

