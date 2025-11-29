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

              {/* Legal */}
              <div className="contact-legal flex flex-col gap-4">
                <Link to="/privacy-policy" className="contact-link email-link">{t('legal.privacy_policy')}</Link>
                <Link to="/terms-conditions" className="contact-link email-link">{t('legal.terms_conditions')}</Link>
                <Link to="/cookie-policy" className="contact-link email-link">{t('legal.cookie_policy')}</Link>
                <Link to="/disclaimers" className="contact-link email-link">{t('legal.disclaimers.title')}</Link>
              </div>

              {/* Ayuda */}
              <div className="contact-help flex flex-col gap-4">
                <a href="#faq" className="contact-link email-link">{t('contact_section.footer.help.faq')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-bottom">
          {/* Footer Columns - Removed as per request */}
          <div className="footer-columns hidden">
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

