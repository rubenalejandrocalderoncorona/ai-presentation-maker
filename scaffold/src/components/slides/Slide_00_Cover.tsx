import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'

const CHIPS = ['React', 'TypeScript', 'Framer Motion', 'TailwindCSS', 'Vite']

interface Props { animStep?: number }

export function Slide_00_Cover({ animStep = 0 }: Props) {
  return (
    <div className="slide-container blueprint-grid" style={{ background: '#f0f4ff' }}>
      {/* Background blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)', filter: 'blur(60px)' }}
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10), transparent)', filter: 'blur(60px)' }}
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 p-4 rounded-2xl bg-indigo-100 border border-indigo-200"
      >
        <Layers className="w-10 h-10 text-indigo-600" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl font-bold text-slate-800 text-center mb-3"
      >
        Presentation Title
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-xl text-slate-500 text-center mb-8 max-w-xl"
      >
        Subtitle goes here
      </motion.p>

      {/* Chips — reveal one per spacebar press */}
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {CHIPS.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={animStep > i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 border border-indigo-200 text-indigo-700"
          >
            {chip}
          </motion.span>
        ))}
      </div>

      {/* Author */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-16 text-sm text-slate-400"
      >
        Author Name · Role · Organization
      </motion.div>
    </div>
  )
}
