import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface Props { src: string; className?: string }

export default function ScrollVideo({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // buffer tracking

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const startPlayback = async () => {
      video.muted = true
      try {
        await video.play()
      } catch {
        // Autoplay may be blocked until interaction. We still keep the video loaded and scroll-synced.
      }
    }

    const isHlsSource = /\.m3u8(?:\?|$)/i.test(src)

    if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 120, maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024 * 1024, startPosition: 0,
        capLevelToPlayerSize: false, startLevel: -1, autoStartLoad: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void startPlayback()
      })
      return () => hls.destroy()
    }

    video.src = src
    video.load()
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0
      void startPlayback()
    }, { once: true })

    return () => {
      video.pause()
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let targetProgress = 0
    let rafId = 0

    const updateTargetFromScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      targetProgress = Math.min(window.scrollY / maxScroll, 1)
    }

    const tick = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        const targetTime = targetProgress * video.duration
        const diff = targetTime - video.currentTime
        if (Math.abs(diff) > 0.05) {
          video.currentTime += diff * 0.12
        }
      }
      rafId = window.requestAnimationFrame(tick)
    }

    updateTargetFromScroll()
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true })
    window.addEventListener('resize', updateTargetFromScroll)
    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateTargetFromScroll)
      window.removeEventListener('resize', updateTargetFromScroll)
    }
  }, [])

  return (
    <video ref={videoRef} muted autoPlay playsInline loop preload="auto"
      className={className}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
    />
  )
}
