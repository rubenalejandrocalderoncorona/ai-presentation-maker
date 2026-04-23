import { AnimatePresence, motion } from 'framer-motion'
import { Navigation } from './components/Navigation'
import { Slide_00_Cover } from './components/slides/Slide_00_Cover'
import { usePresentation } from './hooks/usePresentation'

// ── Slide registry ────────────────────────────────────────────────────────────
// Index matches TOTAL_SLIDES and SLIDE_ANIM_STEPS in usePresentation.ts
const slides: React.ComponentType<{ animStep?: number }>[] = [
  Slide_00_Cover,   // 0
  // Add more slides here …
]

// Slides that consume animStep prop
const ANIMATED_SLIDES = new Set([0])

export function App() {
  const { currentSlide, totalSlides, goNext, goPrev, goTo, animStep } = usePresentation()
  const SlideComponent = slides[currentSlide]
  const slideProps = ANIMATED_SLIDES.has(currentSlide) ? { animStep } : {}

  return (
    <div className="w-full h-full bg-[#f0f4ff] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="w-full h-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <SlideComponent {...slideProps} />
        </motion.div>
      </AnimatePresence>

      <Navigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        goNext={goNext}
        goPrev={goPrev}
        goTo={goTo}
      />
    </div>
  )
}
