"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function EnhancedClickAnimation() {
  const [clickEffects, setClickEffects] = useState<{ x: number; y: number; id: number }[]>([])
  const isAnimating = useRef(false)
  const maxConcurrentAnimations = 2

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Limit the number of concurrent animations for performance
      if (clickEffects.length >= maxConcurrentAnimations || isAnimating.current) return

      isAnimating.current = true

      const newEffect = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      }

      setClickEffects((prev) => [...prev, newEffect])

      // Remove effect after animation completes
      setTimeout(() => {
        setClickEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
        isAnimating.current = false
      }, 800)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [clickEffects])

  return (
    <AnimatePresence>
      {clickEffects.map((effect) => (
        <motion.div
          key={effect.id}
          className="fixed pointer-events-none z-[9995]"
          style={{
            left: effect.x,
            top: effect.y,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Inner circle */}
          <motion.div
            className="absolute rounded-full bg-white"
            style={{
              left: "-4px",
              top: "-4px",
              width: "8px",
              height: "8px",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* Outer ring */}
          <motion.div
            className="absolute rounded-full border border-white"
            style={{
              left: "-20px",
              top: "-20px",
              width: "40px",
              height: "40px",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Particles - only render 4 for better performance */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2
            const distance = 50
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: 3,
                  height: 3,
                  x: -1.5,
                  y: -1.5,
                }}
                initial={{ opacity: 0.8 }}
                animate={{
                  x: Math.cos(angle) * distance - 1.5,
                  y: Math.sin(angle) * distance - 1.5,
                  opacity: 0,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )
          })}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

