import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

interface Props { text: string }

export default function ScrollFloat({ text }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chars = ref.current?.querySelectorAll('.char')
    if (!chars) return
    gsap.fromTo(chars,
      { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: '50% 0%' },
      { opacity: 0, yPercent: 250, scaleY: 1.2, scaleX: 0.9,
        stagger: 0.05, ease: 'power2.inOut', duration: 1,
        scrollTrigger: { trigger: document.body, start: 'top top', end: '+=1000', scrub: 1.5 }
      }
    )
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem', pointerEvents: 'none', zIndex: 10 }}>
      {text.split('\n').map((line, li) => (
        <div key={li} className="scroll-float-text">
          {line.split(' ').map((word, wi) => (
            <span key={wi} style={{ display: 'inline-block', marginRight: '0.3em' }}>
              {word.split('').map((char, ci) => (
                <span key={ci} className="char" style={{
                  fontFamily: 'var(--font-dirtyline)',
                  fontSize: 'clamp(4rem, 15vw, 317px)',
                  lineHeight: 0.85,
                  color: 'white',
                  display: 'inline-block',
                }}>{char}</span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
