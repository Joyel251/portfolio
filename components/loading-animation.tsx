"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SpaceLoading() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress > 100 ? 100 : newProgress
      })
    }, 200)

    // Hide loading animation after it completes
    const timer = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative w-40 h-40 mb-8">
            {/* Space-themed loading animation */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Outer orbit */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full rounded-full border border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                {/* Planet */}
                <motion.div
                  className="absolute w-4 h-4 rounded-full bg-white"
                  style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
              </motion.div>

              {/* Middle orbit */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                {/* Planet */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-white/80"
                  style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
              </motion.div>

              {/* Inner orbit */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                {/* Planet */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-white/90"
                  style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
              </motion.div>

              {/* Center star */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 10px rgba(255, 255, 255, 0.5)",
                    "0 0 20px rgba(255, 255, 255, 0.8)",
                    "0 0 10px rgba(255, 255, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-px bg-white/10 mb-4 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Loading text */}
          <motion.div
            className="text-xs tracking-[0.3em] uppercase text-white/70 font-space"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {progress < 100 ? "INITIALIZING" : "READY"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

