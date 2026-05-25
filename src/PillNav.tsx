import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollToPlugin)

const NAV = ['IMAGE', 'VIDEO', 'ABOUT', 'CONTACT']

export default function PillNav() {
  const logoRef = useRef<HTMLDivElement>(null)
  const logoSvgRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logoRef.current) gsap.from(logoRef.current, { scale: 0, duration: 0.6, ease: 'back.out(1.7)' })
    if (navItemsRef.current) gsap.from(navItemsRef.current, { width: 0, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' })

    pillRefs.current.forEach((pill) => {
      if (!pill) return
      const circle = pill.querySelector('.hover-circle') as HTMLElement
      const label = pill.querySelector('.pill-label') as HTMLElement
      const labelHover = pill.querySelector('.pill-label-hover') as HTMLElement
      if (!circle || !label || !labelHover) return
      const w = pill.offsetWidth, h = pill.offsetHeight
      const R = (w * w / 4 + h * h) / (2 * h)
      const D = 2 * R + 2
      const delta = R - Math.sqrt(R * R - w * w / 4) + 1
      circle.style.width = `${D}px`; circle.style.height = `${D}px`
      circle.style.left = `${(w - D) / 2}px`; circle.style.bottom = `-${delta}px`
      circle.style.transformOrigin = `50% ${D - delta}px`
      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 3, duration: 0.3, ease: 'power2.out' }, 0)
        .to(label, { yPercent: -110, duration: 0.3, ease: 'power2.out' }, 0)
        .fromTo(labelHover, { yPercent: 110 }, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, 0)
      pill.addEventListener('mouseenter', () => gsap.to(tl, { progress: 1, duration: 0.3 }))
      pill.addEventListener('mouseleave', () => gsap.to(tl, { progress: 0, duration: 0.2 }))
    })
  }, [])

  useEffect(() => {
    if (!popoverRef.current) return
    if (menuOpen) {
      popoverRef.current.style.visibility = 'visible'
      gsap.fromTo(popoverRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 })
    } else {
      gsap.to(popoverRef.current, { opacity: 0, y: -10, duration: 0.2, onComplete: () => { if (popoverRef.current) popoverRef.current.style.visibility = 'hidden' } })
    }
    if (line1Ref.current && line2Ref.current) {
      gsap.to(line1Ref.current, { rotation: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0, duration: 0.3 })
      gsap.to(line2Ref.current, { rotation: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0, duration: 0.3 })
    }
  }, [menuOpen])

  function handleNav(item: string) {
    if (item === 'IMAGE') {
      gsap.to(window, { duration: 1.5, scrollTo: '#image-panel', ease: 'power3.inOut' })
      return
    }
    if (item === 'VIDEO') {
      gsap.to(window, { duration: 1.5, scrollTo: '#video-panel', ease: 'power3.inOut' })
      return
    }
    if (item === 'ABOUT') {
      gsap.to(window, { duration: 1.5, scrollTo: '#about-panel', ease: 'power3.inOut' })
      return
    }
    if (item === 'CONTACT') {
      gsap.to(window, { duration: 1.5, scrollTo: '#contact-panel', ease: 'power3.inOut' })
      return
    }
  }

  return (
    <>
      {/* Navbar */}
      <div className="pill-nav-container">
        <div className="pill-nav" style={{ gap: 8 }}>
          <div ref={logoRef} className="pill-logo"
            onMouseEnter={() => logoSvgRef.current && gsap.to(logoSvgRef.current, { rotation: 360, duration: 0.5, ease: 'power2.out' })}
            onMouseLeave={() => logoSvgRef.current && gsap.set(logoSvgRef.current, { rotation: 0 })}>
            <div ref={logoSvgRef} style={{ display: 'flex' }}>
              <svg viewBox="0 0 100 100" width={24} height={24} fill="white">
                <path d="m50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z"/>
                <path d="m17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z"/>
                <path d="m82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z"/>
                <path d="m17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z"/>
              </svg>
            </div>
          </div>

          <div ref={navItemsRef} className="pill-nav-items desktop-only">
            <ul className="pill-list">
              {NAV.map((item, i) => (
                <li key={item}>
                  <button ref={el => { pillRefs.current[i] = el }} className="pill" onClick={() => handleNav(item)}>
                    <div className="hover-circle" />
                    <div className="label-stack">
                      <span className="pill-label">{item}</span>
                      <span className="pill-label-hover">{item}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mobile-only" style={{ position: 'relative' }}>
            <button className="mobile-menu-button" onClick={() => setMenuOpen(o => !o)}>
              <span ref={line1Ref} className="hamburger-line" />
              <span ref={line2Ref} className="hamburger-line" />
            </button>
            <div ref={popoverRef} className="mobile-menu-popover" style={{ visibility: 'hidden', opacity: 0 }}>
              <ul className="mobile-menu-list">
                {NAV.map(item => (
                  <li key={item}><a href="#" className="mobile-menu-link" onClick={() => { handleNav(item); setMenuOpen(false) }}>{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
