import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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
      toast.success(t('contact_section.newsletter.success'))
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
    <section id="contacto" className="bg-white min-h-screen flex flex-col text-[#0046b8] text-[clamp(0.875rem,1vw,2rem)]">
      <div
        className="relative w-full flex flex-col flex-1"
        style={{
          paddingLeft: 'var(--base-padding-x)',
          paddingRight: 'var(--base-padding-x)',
          paddingTop: 'calc(var(--vh, 1vh) * 50)',
          paddingBottom: 'var(--base-padding-y)',
        }}
      >
        <div className="grid grid-cols-6 md:grid-cols-12 gap-[2vw] flex-1 rounded-3xl p-8 md:p-12">
          {/* Información de contacto */}
          <div className="col-span-6 md:col-span-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[2vw] text-[0.875em] md:text-[1.25em] leading-[1.4] w-full">
              {/* Dirección */}
              <div className="col-span-1 flex flex-col">
                <div className="text-[#0046b8] text-[1em] leading-[1.4] font-normal">{t('contact_section.address.line1')}</div>
                <div className="text-[#0046b8] text-[1em] leading-[1.4] font-normal">{t('contact_section.address.line2')}</div>
                <div className="text-[#0046b8] text-[1em] leading-[1.4] font-normal">{t('contact_section.address.country')}</div>
              </div>

              {/* Redes sociales y Business */}
              <div className="col-span-1 flex flex-col gap-[2.5em] items-stretch">
                <div className="flex flex-col items-start w-full">
                  <a href="#" className="group flex items-center gap-2 relative overflow-visible w-full mt-[0.3em] first:mt-0">
                    <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                      <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Twitter / X</span>
                  </a>
                  <a href="#" className="group flex items-center gap-2 relative overflow-visible w-full mt-[0.3em]">
                    <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                      <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Instagram</span>
                  </a>
                  <a href="#" className="group flex items-center gap-2 relative overflow-visible w-full mt-[0.3em]">
                    <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                      <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                    <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Linkedin</span>
                  </a>
                </div>
                <div className="flex flex-col">
                  <div className="text-[#0046b8] text-[1em] leading-[1.4] font-normal">{t('contact_section.business')}</div>
                  <a href="mailto:business@tatotoclean.com" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity break-words">business@tatotoclean.com</a>
                </div>
                <div className="flex flex-col">
                  <div className="text-[#0046b8] text-[1em] leading-[1.4] font-normal">{t('contact_section.general_enquiries')}</div>
                  <a href="mailto:contacto@tatotoclean.com" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity break-words">contacto@tatotoclean.com</a>
                </div>
              </div>

              {/* Legal */}
              <div className="col-span-1 flex flex-col gap-4">
                <Link to="/privacy-policy" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity">{t('legal.privacy_policy')}</Link>
                <Link to="/terms-conditions" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity">{t('legal.terms_conditions')}</Link>
                <Link to="/cookie-policy" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity">{t('legal.cookie_policy')}</Link>
                <Link to="/disclaimers" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity">{t('legal.disclaimers.title')}</Link>
              </div>

              {/* Ayuda */}
              <div className="col-span-1 flex flex-col gap-4">
                <a href="#faq" className="text-[#0046b8] text-[1em] leading-[1.4] font-normal hover:opacity-80 transition-opacity">{t('contact_section.footer.help.faq')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 w-full mt-[7vh] pb-20">
          {/* Footer Bottom - Copyright, Labs, Made by */}
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-8 text-center md:text-left flex-col md:flex-row">
            <div className="font-medium">{t('contact_section.footer.bottom.copyright')}</div>
            <a href="https://labs.tatotoclean.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[#0046b8] hover:underline relative group">
              {t('contact_section.footer.bottom.labs')}
            </a>
            <div className="font-medium">
              {t('contact_section.footer.bottom.made_by')} <span className="text-red-500">❤️</span>
            </div>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-0 bottom-0 w-[3.5em] h-[3.5em] bg-black rounded-full flex items-center justify-center overflow-hidden group"
            aria-label={t('contact_section.footer.bottom.aria_label_scroll')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="transition-transform duration-400 ease-[cubic-bezier(0.35,0,0,1)] group-hover:-translate-y-[3em]">
              <path fill="#fff" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="absolute translate-y-[3em] transition-transform duration-400 ease-[cubic-bezier(0.35,0,0,1)] group-hover:translate-y-0">
              <path fill="#fff" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Contact

