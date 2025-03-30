"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function NewLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loading animation after it completes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Reduced from 2500ms for faster loading

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated geometric loader */}
            <div className="relative h-16 w-16 mb-6">
              <motion.div
                className="absolute inset-0 border border-white/20"
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute inset-0 border border-white/40"
                initial={{ opacity: 0, scale: 0.6, rotate: 45 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.6, 1, 0.6],
                  rotate: [45, 405, 45],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />

              <motion.div
                className="absolute inset-0 border border-white/60"
                initial={{ opacity: 0, scale: 0.4, rotate: 90 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.4],
                  rotate: [90, 450, 90],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>

            {/* Loading text */}
            <motion.div
              className="overflow-hidden h-6"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="text-sm tracking-[0.3em] uppercase text-white/70 font-light"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                LOADING
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

