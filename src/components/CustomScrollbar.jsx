import React, { useEffect, useState } from 'react'

const CustomScrollbar = () => {
  const [thumbHeight, setThumbHeight] = useState(30)
  const [thumbTop, setThumbTop] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let scrollTimeout

    const updateScrollbar = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      
      if (scrollHeight <= 0) {
        setVisible(false)
        return
      }
      
      const scrollPercent = scrollTop / scrollHeight
      const scrollbarTrack = 180
      const viewportRatio = window.innerHeight / document.documentElement.scrollHeight
      const newThumbHeight = Math.max(30, viewportRatio * scrollbarTrack)
      const newThumbPosition = scrollPercent * (scrollbarTrack - newThumbHeight)

      setThumbHeight(newThumbHeight)
      setThumbTop(newThumbPosition)
      setVisible(true)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setVisible(false)
      }, 1500)
    }

    window.addEventListener('scroll', updateScrollbar, { passive: true })
    window.addEventListener('resize', updateScrollbar)
    
    updateScrollbar()
    
    setTimeout(() => {
      if (document.documentElement.scrollHeight > window.innerHeight) {
        updateScrollbar()
      }
    }, 100)

    return () => {
      window.removeEventListener('scroll', updateScrollbar)
      window.removeEventListener('resize', updateScrollbar)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <div className={`scrollbar-custom ${visible ? 'visible' : ''}`} id="customScrollbar">
      <div 
        className="scrollbar-thumb" 
        id="scrollbarThumb"
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`
        }}
      ></div>
    </div>
  )
}

export default CustomScrollbar

