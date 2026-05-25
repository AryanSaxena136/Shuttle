import ScrollVideo from './ScrollVideo'
import ScrollFloat from './ScrollFloat'
import GlassPanel from './GlassPanel'
import PillNav from './PillNav'

export default function App() {
  return (
    <div style={{ position: 'relative', height: '500vh' }}>
      <ScrollVideo src="https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8" />
      <GlassPanel>
        <PillNav />
      </GlassPanel>
      <ScrollFloat text={`Unleash The\nFull Power`} />
      <GlassPanel>
        {/* Image Prediction */}
      </GlassPanel>
      <GlassPanel>
        {/* Video Tracker */}
      </GlassPanel>
    </div>
  )
}
