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
      {/* Main cursor - cartoon rocket ship */}
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
          rotate: isHovering ? 15 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
      >
        <svg
          width={isHovering ? "40" : "30"}
          height={isHovering ? "40" : "30"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.3s, width 0.3s, height 0.3s",
          }}
        >
          {/* Rocket body */}
          <motion.path
            d="M12 2L8 10H16L12 2Z"
            fill="white"
            animate={{
              fill: isHovering ? "#4477ff" : "white",
            }}
          />
          <motion.path
            d="M8 10H16V18H8V10Z"
            fill="white"
            animate={{
              fill: isHovering ? "#4477ff" : "white",
            }}
          />

          {/* Windows */}
          <circle cx="12" cy="14" r="1.5" fill="#000" />

          {/* Fins */}
          <motion.path
            d="M8 12L5 14V16L8 14V12Z"
            fill="white"
            animate={{
              fill: isHovering ? "#ff4477" : "white",
            }}
          />
          <motion.path
            d="M16 12L19 14V16L16 14V12Z"
            fill="white"
            animate={{
              fill: isHovering ? "#ff4477" : "white",
            }}
          />

          {/* Flames - only show when clicking */}
          <motion.path
            d="M10 18L8 22L12 20L16 22L14 18"
            fill="#ff4477"
            animate={{
              opacity: isClicking ? 1 : 0,
              y: isClicking ? [0, 2, 0] : 0,
            }}
            transition={{
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.3,
              },
            }}
          />
        </svg>
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed z-[9998] pointer-events-none w-1 h-1 rounded-full bg-white/30"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible && !isHovering ? 0.5 : 0,
          transition: "opacity 0.3s",
          filter: "blur(1px)",
        }}
        animate={{
          scale: [1, 15],
          opacity: [0.5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </>
  )
}

