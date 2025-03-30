"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CursorPosition {
  x: number
  y: number
}

export default function CursorTrail() {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [trail, setTrail] = useState<CursorPosition[]>([])
  const maxTrailLength = 20

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail, mousePosition]
        if (newTrail.length > maxTrailLength) {
          return newTrail.slice(newTrail.length - maxTrailLength)
        }
        return newTrail
      })
    }, 20)

    return () => clearInterval(interval)
  }, [mousePosition])

  return (
    <>
      {trail.map((position, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute z-50 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-sm"
          animate={{
            x: position.x - 8,
            y: position.y - 8,
            scale: 1 - index * 0.03,
            opacity: 1 - index * 0.05,
          }}
          transition={{ duration: 0 }}
        />
      ))}
      <motion.div
        className="pointer-events-none absolute z-50 h-8 w-8 rounded-full bg-white opacity-30 mix-blend-screen blur-md"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </>
  )
}

