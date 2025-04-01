"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function OptimizedClickAnimation() {
  const [clickRipples, setClickRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const isAnimating = useRef(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Limit the number of concurrent animations for performance
      if (clickRipples.length >= 3 || isAnimating.current) return

      isAnimating.current = true

      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      }

      setClickRipples((prev) => [...prev, newRipple])
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [clickRipples])

  return (
    <>
      <style jsx global>{`
        @keyframes neonPulse {
          0% { filter: drop-shadow(0 0 2px #FF1E6F); }
          50% { filter: drop-shadow(0 0 6px #FF38BD); }
          100% { filter: drop-shadow(0 0 2px #FF1E6F); }
        }
        .neon-particle {
          animation: neonPulse 0.5s ease-in-out;
          mix-blend-mode: screen;
        }
        .click-flash {
          mix-blend-mode: screen;
          pointer-events: none;
        }
      `}</style>
      <AnimatePresence>
        {clickRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setClickRipples((prev) => prev.filter((r) => r.id !== ripple.id))
              isAnimating.current = false
            }}
            className="fixed z-[9998] pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Explosive ring effect */}
            <motion.svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="neon-particle"
            >
              <defs>
                <radialGradient id={`explosionGradient-${ripple.id}`}>
                  <stop offset="0%" stopColor="#FF1E6F" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#FF38BD" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FF8D1E" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`viceGradient-${ripple.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF1E6F' }} />
                  <stop offset="50%" style={{ stopColor: '#FF38BD' }} />
                  <stop offset="100%" style={{ stopColor: '#FF8D1E' }} />
                </linearGradient>
              </defs>
              <circle
                cx="40"
                cy="40"
                r="20"
                fill={`url(#explosionGradient-${ripple.id})`}
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </motion.svg>

            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.svg
                key={i}
                width="8"
                height="8"
                viewBox="0 0 8 8"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  opacity: 1,
                  rotate: i * 45 
                }}
                animate={{ 
                  x: Math.cos(i * Math.PI/4) * 40,
                  y: Math.sin(i * Math.PI/4) * 40,
                  scale: 0,
                  opacity: 0,
                  rotate: i * 45 + 90
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="neon-particle"
              >
                <path
                  d="M4 0L8 4L4 8L0 4L4 0Z"
                  fill={`url(#viceGradient-${ripple.id})`}
                />
              </motion.svg>
            ))}

            {/* Shockwave effect */}
            <motion.svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              style={{ position: 'absolute', top: -10, left: -10 }}
              initial={{ scale: 0.5, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="neon-particle"
            >
              <path
                d="M30 15L45 30L30 45L15 30L30 15Z"
                stroke={`url(#viceGradient-${ripple.id})`}
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
              />
            </motion.svg>

            {/* Flash effect */}
            <motion.div
              className="click-flash"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(255,30,111,0.3) 0%, rgba(255,56,189,0) 70%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}
