import ScrollVideo from './ScrollVideo'
import ScrollFloat from './ScrollFloat'
import GlassPanel from './GlassPanel'
import PillNav from './PillNav'

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '650vh', backgroundColor: 'black' }}>
      <PillNav />
      
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ScrollVideo src="https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8" />
        <ScrollFloat text={`Unleash The\nFull Power`} />
      </div>

      <div style={{ height: '150vh', position: 'relative' }}>
        <GlassPanel id="image-panel" title="Image Prediction" type="image" />
      </div>

      <div style={{ height: '150vh', position: 'relative' }}>
        <GlassPanel id="video-panel" title="Video Tracking" type="video" />
      </div>

      <div style={{ height: '150vh', position: 'relative' }}>
        <GlassPanel id="about-panel" title="About Shuttle AI" showMarquee={false}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '800px', padding: '24px 0' }}>
            <p>Shuttle AI is a next-generation computer vision platform designed for high-performance object detection and real-time tracking.</p>
            <p style={{ marginTop: '1.5rem' }}>Utilizing state-of-the-art YOLO (You Only Look Once) models, our system provides lightning-fast predictions on both static images and dynamic video streams, optimized for accuracy and throughput.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '3rem' }}>
              <div>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>High Precision</h4>
                <p style={{ fontSize: '1rem' }}>Our models are trained on diverse datasets to ensure robust performance across various environments and lighting conditions.</p>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>Real-time Analysis</h4>
                <p style={{ fontSize: '1rem' }}>Process video streams at 30+ FPS with ultra-low latency, perfect for security, sports analytics, and industrial automation.</p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div style={{ height: '100vh', position: 'relative' }}>
        <GlassPanel id="contact-panel" title="Get In Touch" showMarquee={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px 0' }}>
            <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(45deg, #333, #666)', flexShrink: 0 }}></div>
              <div>
                <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'white' }}>Aryan Saxena</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Lead Developer / AI Engineer</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '1rem' }}>
              <ContactLink href="https://github.com/AryanSaxena136" label="GitHub" />
              <ContactLink href="https://www.linkedin.com/in/aryan-saxena-95a285330/" label="LinkedIn" />
              <ContactLink href="mailto:example@gmail.com" label="Email" />
              <ContactLink href="https://twitter.com/example" label="Twitter" />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}

function ContactLink({ href, label }: { href: string, label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      padding: '16px 40px',
      borderRadius: '50px',
      background: 'rgba(255,255,255,0.05)',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s'
    }} 
    onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white' }}
    >
      {label}
    </a>
  )
}
