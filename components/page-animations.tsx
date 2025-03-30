"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PageAnimations() {
  const [showInitialAnimation, setShowInitialAnimation] = useState(true)

  useEffect(() => {
    // Hide initial animation after it completes
    const timer = setTimeout(() => {
      setShowInitialAnimation(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Initial page load animation */}
      <AnimatePresence>
        {showInitialAnimation && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl font-display text-white tracking-widest"
            >
              PORTFOLIO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating elements that appear randomly */}
      <div className="fixed inset-0 z-[5] pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <FloatingElement key={i} index={i} />
        ))}
      </div>
    </>
  )
}

function FloatingElement({ index }: { index: number }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Set random initial position
    setPosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    })

    // Move to a new position every 10-15 seconds
    const interval = setInterval(
      () => {
        setPosition({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })
      },
      10000 + Math.random() * 5000,
    )

    return () => clearInterval(interval)
  }, [])

  // Different shapes based on index
  const getShape = () => {
    switch (index % 3) {
      case 0:
        return <div className="w-4 h-4 rounded-full bg-white/10 backdrop-blur-sm" />
      case 1:
        return <div className="w-6 h-6 rotate-45 bg-white/5 backdrop-blur-sm" />
      case 2:
        return <div className="w-8 h-1 bg-white/10 backdrop-blur-sm" />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="absolute"
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{
        x: position.x,
        y: position.y,
        opacity: 0.5,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 10 + Math.random() * 5,
        ease: "linear",
      }}
    >
      {getShape()}
    </motion.div>
  )
}

