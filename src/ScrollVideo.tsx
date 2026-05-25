import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface Props { src: string; className?: string }

export default function ScrollVideo({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // buffer tracking

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 120, maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024 * 1024, startPosition: 0,
        capLevelToPlayerSize: false, startLevel: -1, autoStartLoad: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const maxLevel = data.levels.length - 1
        hls.currentLevel = maxLevel
        hls.startLevel = maxLevel
        video.pause()
      })
      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        if (video.buffered.length > 0 && video.duration) {
          // buffered
        }
      })
      return () => hls.destroy()
    } else {
      video.src = src
      video.pause()
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(scrollY / maxScroll, 1)
      if (video.duration) video.currentTime = progress * video.duration
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <video ref={videoRef} muted playsInline preload="auto"
      className={className}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
    />
  )
}
