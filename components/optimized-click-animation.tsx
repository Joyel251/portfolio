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

      // Remove ripple after animation completes
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
        isAnimating.current = false
      }, 600)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [clickRipples])

  return (
    <AnimatePresence>
      {clickRipples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </AnimatePresence>
  )
}

