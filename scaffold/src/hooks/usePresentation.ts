import { useState, useEffect, useRef, useCallback } from 'react'

// Update this to match the exact number of slide components in App.tsx
export const TOTAL_SLIDES = 3

// Declare max spacebar sub-steps for each slide index.
// Slides NOT listed here get 0 sub-steps (arrow-key navigation only).
const SLIDE_ANIM_STEPS: Record<number, number> = {
  0: 4,  // cover: 4 chip reveals
  2: 3,  // example: 3 content reveals
}

export function usePresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animStep, setAnimStep] = useState(0)

  const slideRef = useRef(currentSlide)
  const stepRef  = useRef(animStep)

  useEffect(() => { slideRef.current = currentSlide }, [currentSlide])
  useEffect(() => { stepRef.current  = animStep      }, [animStep])

  const resetStep = useCallback(() => setAnimStep(0), [])

  const goNext = useCallback(() => {
    setCurrentSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1))
    resetStep()
  }, [resetStep])

  const goPrev = useCallback(() => {
    setCurrentSlide(s => Math.max(s - 1, 0))
    resetStep()
  }, [resetStep])

  const goTo = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, TOTAL_SLIDES - 1)))
    resetStep()
  }, [resetStep])

  const stepForward = useCallback(() => {
    const maxSteps = SLIDE_ANIM_STEPS[slideRef.current] ?? 0
    if (stepRef.current < maxSteps) {
      setAnimStep(s => s + 1)
    } else {
      goNext()
    }
  }, [goNext])

  const stepBack = useCallback(() => {
    if (stepRef.current > 0) {
      setAnimStep(s => s - 1)
    } else {
      goPrev()
    }
  }, [goPrev])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          stepForward()
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goPrev()
          break
        case 'b':
        case 'B':
          e.preventDefault()
          stepBack()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stepForward, stepBack, goNext, goPrev])

  return { currentSlide, totalSlides: TOTAL_SLIDES, goNext, goPrev, goTo, animStep }
}
