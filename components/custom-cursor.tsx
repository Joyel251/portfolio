"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Mouse position with spring physics for smoother movement
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
      let lastTime = 0
      const throttleInterval = 10 // Small throttle for smooth cursor movement

      const updatePosition = (e: MouseEvent) => {
        const now = Date.now()
        if (now - lastTime < throttleInterval) return

        lastTime = now
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

      window.addEventListener("mousemove", updatePosition, { passive: true })

      // Add event listeners to interactive elements
      const interactiveElements = document.querySelectorAll("a, button, input, [role='button'], .letter")
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

        interactiveElements.forEach((el) => {
          el.removeEventListener("mouseenter", handleElementEnter)
          el.removeEventListener("mouseleave", handleElementLeave)
        })
      }
    }
  }, [mouseX, mouseY])

  // Don't render custom cursor on touch devices
  if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(pointer: fine)").matches) {
    return null
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 0.8 : 0,
        }}
      >
        {/* Star-shaped cursor */}
        <motion.div
          className="relative"
          animate={{
            rotate: isHovering ? 45 : 0,
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute bg-white"
            style={{
              width: "2px",
              height: "16px",
              left: "-1px",
              top: "-8px",
            }}
          />
          <div
            className="absolute bg-white"
            style={{
              width: "16px",
              height: "2px",
              left: "-8px",
              top: "-1px",
            }}
          />
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: "4px",
              height: "4px",
              left: "-2px",
              top: "-2px",
            }}
          />
        </motion.div>
      </motion.div>
    </>
  )
}

