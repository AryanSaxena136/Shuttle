import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const API = 'http://localhost:8000'
const BRANDS = ['SHUTTLE', 'DETECT', 'YOLO', 'FASTAPI', 'VISION', 'TRACK']
const MARQUEE = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS]

function UploadSection({
  id, label, accept, onFile, onPredict, loading, result, type
}: {
  id: string, label: string, accept: string,
  onFile: (f: File) => void, onPredict: () => void,
  loading: boolean, result: string | null, type: 'image' | 'video'
}) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFileName(f.name); onFile(f) }
  }

  return (
    <div id={id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Left: Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Upload {label}
        </p>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-${id}`)?.click()}
          style={{
            border: `2px dashed ${dragging ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 16, padding: '40px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'border-color 0.2s',
            background: dragging ? 'rgba(255,255,255,0.05)' : 'transparent',
            flex: 1,
          }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⊕</div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {fileName ?? 'Choose or drag file here'}
          </p>
          <input id={`file-${id}`} type="file" accept={accept} style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); onFile(f) } }} />
        </div>

        <button onClick={onPredict} disabled={!fileName || loading} style={{
          background: loading ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
          color: '#000', border: 'none', borderRadius: 50,
          padding: '12px 0', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: fileName && !loading ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
        }}>
          {loading ? 'Processing...' : `Upload ${label}`}
        </button>
      </div>

      {/* Right: Output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Output {label}
        </p>

        <div style={{
          flex: 1, border: '2px solid rgba(255,255,255,0.1)', borderRadius: 16,
          background: 'rgba(255,255,255,0.03)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 160,
        }}>
          {result ? (
            type === 'image'
              ? <img src={result} alt="output" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 14 }} />
              : <video src={result} controls style={{ width: '100%', borderRadius: 14 }} />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Output {label} preview</p>
          )}
        </div>

        <a href={result ?? '#'} download={`annotated.${type === 'image' ? 'jpg' : 'mp4'}`}
          style={{
            display: 'block', textAlign: 'center',
            background: result ? '#f0f0f0' : 'rgba(255,255,255,0.05)',
            color: result ? '#000' : 'rgba(255,255,255,0.3)',
            borderRadius: 50, padding: '12px 0',
            fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
            textTransform: 'uppercase', textDecoration: 'none',
            pointerEvents: result ? 'auto' : 'none', transition: 'background 0.2s',
          }}>
          Download
        </a>
      </div>
    </div>
  )
}

export default function GlassPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageResult, setImageResult] = useState<string | null>(null)
  const [videoResult, setVideoResult] = useState<string | null>(null)
  const [loadingImg, setLoadingImg] = useState(false)
  const [loadingVid, setLoadingVid] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !wrapRef.current) return
    gsap.fromTo(wrapRef.current, { y: '100%' }, {
      y: '0%', ease: 'none',
      scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'bottom bottom', scrub: 1.5 }
    })
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const onMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect()
      const moveX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const moveY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      gsap.to(panel, { x: moveX * 10, y: moveY * 10, rotationY: moveX * 2, rotationX: -moveY * 2, ease: 'power3.out', duration: 1 })
    }
    const onLeave = () => gsap.to(panel, { x: 0, y: 0, rotationY: 0, rotationX: 0, ease: 'power3.out', duration: 1 })
    panel.addEventListener('mousemove', onMove)
    panel.addEventListener('mouseleave', onLeave)
    return () => { panel.removeEventListener('mousemove', onMove); panel.removeEventListener('mouseleave', onLeave) }
  }, [])

  async function sendImage() {
    if (!imageFile) return
    setLoadingImg(true); setImageResult(null)
    const form = new FormData(); form.append('file', imageFile)
    const res = await fetch(`${API}/predict/image`, { method: 'POST', body: form })
    setImageResult(URL.createObjectURL(await res.blob()))
    setLoadingImg(false)
  }

  async function sendVideo() {
    if (!videoFile) return
    setLoadingVid(true); setVideoResult(null)
    const form = new FormData(); form.append('file', videoFile)
    const res = await fetch(`${API}/predict/video`, { method: 'POST', body: form })
    setVideoResult(URL.createObjectURL(await res.blob()))
    setLoadingVid(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 20 }}>
      <div ref={wrapRef} style={{ width: '100%', maxWidth: 1250, perspective: 1000 }}>
        <div ref={panelRef} style={{
          width: '100%', display: 'flex', flexDirection: 'column',
          borderRadius: '24px 24px 0 0', overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.16)', backdropFilter: 'blur(160px)',
          WebkitBackdropFilter: 'blur(160px)', border: '1px solid rgba(255,255,255,0.1)',
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}>

          {/* Header */}
          <div style={{ padding: '28px 40px 0', display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-dirtyline)', fontSize: 'clamp(2rem, 4vw, 52px)', color: 'white', margin: 0, lineHeight: 1 }}>
              AI Powered Shuttle Tracker
            </h2>
          </div>

          {/* Image Section */}
          <UploadSection
            id="image-section" label="Image" accept="image/*"
            onFile={setImageFile} onPredict={sendImage}
            loading={loadingImg} result={imageResult} type="image"
          />

          {/* Video Section */}
          <UploadSection
            id="video-section" label="Video" accept="video/*"
            onFile={setVideoFile} onPredict={sendVideo}
            loading={loadingVid} result={videoResult} type="video"
          />

          {/* Marquee */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
              {MARQUEE.map((b, i) => (
                <span key={i} style={{ padding: '0 2rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.3s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
