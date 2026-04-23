import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
  currentSlide: number
  totalSlides: number
  goNext: () => void
  goPrev: () => void
  goTo: (index: number) => void
}

export function Navigation({ currentSlide, totalSlides, goNext, goPrev, goTo }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <>
      {/* Fullscreen toggle — top right */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/70 backdrop-blur border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-white transition-all shadow-sm"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen
          ? <Minimize2 className="w-4 h-4" />
          : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Bottom nav */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/80 backdrop-blur border border-slate-200 rounded-full px-4 py-2 shadow-md">
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide
                  ? 'bg-indigo-500 scale-125'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="text-xs text-slate-400 ml-1 tabular-nums">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>
    </>
  )
}
