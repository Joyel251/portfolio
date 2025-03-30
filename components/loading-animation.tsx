"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loading animation after it completes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            {/* Animated lines */}
            <div className="relative h-20 w-20">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white"
                  style={{
                    width: i % 2 === 0 ? "100%" : "2px",
                    height: i % 2 === 0 ? "2px" : "100%",
                    left: i === 3 ? "100%" : 0,
                    top: i === 2 ? "100%" : 0,
                    originX: i === 3 ? 1 : 0,
                    originY: i === 2 ? 1 : 0,
                  }}
                  initial={{ scaleX: i % 2 === 0 ? 0 : 1, scaleY: i % 2 === 0 ? 1 : 0 }}
                  animate={{ scaleX: 1, scaleY: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </div>

            {/* Animated text */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.div
                className="h-0.5 w-0 bg-white mx-auto mb-2"
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.6 }}
              />
              <div className="overflow-hidden">
                <motion.div
                  className="text-xs tracking-[0.3em] uppercase"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Loading
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

