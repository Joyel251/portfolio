"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import anime from 'animejs'

interface LoadingAnimationProps {
  onLoadingComplete: () => void
}

const quotes = [
  "When I'm gone, they'll just find another monster.",
  "We're more ghosts than people.",
  "Design is not just what it looks like, it's how it works.",
  "Code is poetry written in logic.",
  "In the world of digital art, creativity knows no bounds."
]

export default function LoadingAnimation({ onLoadingComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [currentQuote, setCurrentQuote] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    // Select random quote
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])

    // Animate SVG path
    if (pathRef.current) {
      anime({
        targets: pathRef.current,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: 300,
        loop: true,
        direction: 'alternate'
      })
    }

    // Rotate SVG
    if (svgRef.current) {
      anime({
        targets: svgRef.current,
        rotate: '360deg',
        easing: 'linear',
        duration: 10000,
        loop: true
      })
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => {
              onLoadingComplete()
            }, 1000)
          }, 500)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center vignette"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="w-full max-w-2xl px-4 flex flex-col items-center">
            {/* RDR2-style Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-12"
            >
              <h1 className="text-white/90 text-4xl md:text-5xl font-serif tracking-wider rdr2-text-shadow">
                LOADING
              </h1>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-16 px-4 text-center"
            >
              <p className="text-white/70 text-lg md:text-xl italic font-serif rdr2-text-shadow">
                "{currentQuote}"
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-full max-w-md relative">
              <motion.div
                className="h-0.5 w-full bg-white/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Progress Bar Fill */}
              <motion.div
                className="absolute top-0 left-0 h-0.5 bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />

              {/* Loading Percentage */}
              <motion.div
                className="absolute -top-8 text-white/70 text-sm tracking-widest rdr2-text-shadow"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              >
                {progress}%
              </motion.div>
            </div>

            {/* Animated SVG */}
            <svg
              ref={svgRef}
              className="absolute bottom-12 w-24 h-24"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={pathRef}
                d="M50 10 L90 50 L50 90 L10 50 Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-30"
              />
            </svg>
          </div>

          {/* Enhanced Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/80 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

