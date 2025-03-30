"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from "framer-motion"

interface DraggableNameProps {
  name: string
  className?: string
}

export default function DraggableName({ name, className = "" }: DraggableNameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [letterColors, setLetterColors] = useState<string[]>(Array(name.length).fill(""))
  const controls = useAnimation()

  // Motion values for 3D rotation
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Spring physics for smoother rotation
  const springConfig = { damping: 15, stiffness: 150 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  // For mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Transform mouse position to rotation
  const transformX = useTransform(mouseY, [-300, 300], [15, -15])
  const transformY = useTransform(mouseX, [-300, 300], [-15, 15])

  // Handle mouse move for rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isDragging || !isHovered) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, isDragging, isHovered])

  // Update rotation based on mouse position
  useEffect(() => {
    if (!isDragging && isHovered) {
      const unsubscribeX = transformX.onChange((latest) => {
        rotateX.set(latest)
      })

      const unsubscribeY = transformY.onChange((latest) => {
        rotateY.set(latest)
      })

      return () => {
        unsubscribeX()
        unsubscribeY()
      }
    }
  }, [transformX, transformY, rotateX, rotateY, isDragging, isHovered])

  // Reset rotation when dragging stops or mouse leaves
  useEffect(() => {
    if (!isDragging && !isHovered) {
      rotateX.set(0)
      rotateY.set(0)
    }
  }, [isDragging, isHovered, rotateX, rotateY])

  // Return to original position when released
  const handleDragEnd = () => {
    setIsDragging(false)
    controls.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    })
  }

  // Generate random color for letter click
  const getRandomColor = () => {
    // Use only white with varying opacity for monochrome theme
    const opacity = Math.random() * 0.5 + 0.5 // Between 0.5 and 1
    return `rgba(255, 255, 255, ${opacity})`
  }

  // Handle letter click to change color
  const handleLetterClick = (index: number) => {
    const newColors = [...letterColors]
    newColors[index] = getRandomColor()
    setLetterColors(newColors)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`perspective-container ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="draggable-name font-serif"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
        drag
        dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
        dragElastic={0.05}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        animate={controls}
      >
        {name.split("").map((letter, index) => (
          <motion.span
            key={index}
            className="letter inline-block cursor-pointer"
            style={{
              color: letterColors[index] || "white",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
            }}
            whileHover={{
              scale: 1.2,
              z: 20,
              transition: { duration: 0.2 },
            }}
            onClick={() => handleLetterClick(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: index * 0.05,
                duration: 0.5,
              },
            }}
          >
            {letter === " " ? <span>&nbsp;</span> : letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

