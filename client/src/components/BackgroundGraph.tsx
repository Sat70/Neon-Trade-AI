import { motion } from 'framer-motion'

const graphPoints = [
  { x: 0, y: 120 },
  { x: 60, y: 110 },
  { x: 120, y: 90 },
  { x: 200, y: 100 },
  { x: 260, y: 70 },
  { x: 320, y: 80 },
  { x: 380, y: 40 },
  { x: 460, y: 55 },
  { x: 540, y: 20 },
]

const pathData = graphPoints.reduce((acc, point, index) => {
  if (index === 0) return `M ${point.x},${point.y}`
  return `${acc} L ${point.x},${point.y}`
}, '')

const BackgroundGraph = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      <motion.svg
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-full h-full"
        viewBox="0 0 640 200"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {graphPoints.slice(2, -1).map((point, index) => (
          <motion.circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#5eead4"
            opacity={0.9}
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: 0.6 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        ))}
      </motion.svg>
    </div>
  )
}

export default BackgroundGraph

