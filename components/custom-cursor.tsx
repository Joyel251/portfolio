"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [isClicking, setIsClicking] = useState(false)

  // Mouse position with spring physics for smoother movement
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = !window.matchMedia("(pointer: fine)").matches
      setIsMobile(isMobileDevice)
      return isMobileDevice
    }

    const isMobileDevice = checkMobile()
    window.addEventListener("resize", checkMobile)

    // Only enable custom cursor on non-touch devices
    if (!isMobileDevice) {
      const updatePosition = (e: MouseEvent) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
        setIsVisible(true)
      }

      // Handle link hover
      const handleElementEnter = () => {
        setIsHovering(true)
      }

      const handleElementLeave = () => {
        setIsHovering(false)
      }

      // Handle mouse down/up for click animation
      const handleMouseDown = () => {
        setIsClicking(true)
      }

      const handleMouseUp = () => {
        setIsClicking(false)
      }

      window.addEventListener("mousemove", updatePosition)
      window.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mouseup", handleMouseUp)

      // Add event listeners to interactive elements
      const interactiveElements = document.querySelectorAll("a, button, input, [role='button'], .letter, .interactive")
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleElementEnter)
        el.addEventListener("mouseleave", handleElementLeave)
      })

      // Hide when cursor leaves window
      const handleMouseLeave = () => setIsVisible(false)
      window.addEventListener("mouseout", handleMouseLeave)

      return () => {
        window.removeEventListener("mousemove", updatePosition)
        window.removeEventListener("mouseout", handleMouseLeave)
        window.removeEventListener("mousedown", handleMouseDown)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("resize", checkMobile)

        interactiveElements.forEach((el) => {
          el.removeEventListener("mouseenter", handleElementEnter)
          el.removeEventListener("mouseleave", handleElementLeave)
        })
      }
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [mouseX, mouseY])

  // Don't render custom cursor on touch devices
  if (isMobile) return null

  return (
    <>
      {/* Vice City style arrow cursor */}
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.15s",
          }}
          animate={{
            scale: isClicking ? 0.9 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Vice City gradient */}
              <linearGradient id="viceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF1E6F' }} />
                <stop offset="50%" style={{ stopColor: '#FF38BD' }} />
                <stop offset="100%" style={{ stopColor: '#FF8D1E' }} />
              </linearGradient>
              
              {/* Palm tree pattern */}
              <pattern id="palmPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path
                  d="M16 12C16 12 18 10 19 8C20 6 21 5 21 5M16 12C16 12 14 10 13 8C12 6 11 5 11 5M16 12V18"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            {/* Main cursor arrow */}
            <path
              d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
              fill="url(#viceGradient)"
              stroke="#FF1E6F"
              strokeWidth="1"
            />
            
            {/* Palm tree overlay */}
            <path
              d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
              fill="url(#palmPattern)"
            />

            {/* Neon glow effect */}
            <motion.path
              d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
              stroke="#FF1E6F"
              strokeWidth="2"
              strokeOpacity="0.5"
              fill="none"
              animate={{
                strokeOpacity: [0.2, 0.5, 0.2],
                scale: isHovering ? 1.1 : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Click effect */}
      {isClicking && (
        <motion.div
          className="fixed z-[9998] pointer-events-none"
          style={{
            x: springX,
            y: springY,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Simple scale animation for immediate feedback */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
                stroke="url(#viceGradient)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Hover effect */}
      {isHovering && (
        <motion.div
          className="fixed z-[9997] pointer-events-none"
          style={{
            x: springX,
            y: springY,
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Rotating highlight effect */}
            <motion.svg 
              width="48" 
              height="48" 
              viewBox="0 0 32 32"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Gradient definition for rotating effect */}
              <defs>
                <linearGradient id="rotatingGradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#FF1E6F" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FF38BD" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FF8D1E" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Outer rotating glow */}
              <path
                d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
                stroke="url(#rotatingGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="2 2"
              />
            </motion.svg>

            {/* Static outer ring */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <motion.path
                d="M8 8L8 20L12 16L16 24L20 22L16 14L24 14L8 8Z"
                stroke="url(#viceGradient)"
                strokeWidth="1"
                fill="none"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
