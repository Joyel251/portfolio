"use client"

import { useEffect, useState, useRef } from 'react'
import anime from 'animejs/lib/anime.es.js'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const trailsRef = useRef<HTMLDivElement[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const lastPos = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()
  const isInitialized = useRef<boolean>(false)

  useEffect(() => {
    // Initialize with current mouse position if available
    const initializeCursor = (e: MouseEvent) => {
      if (!isInitialized.current) {
        setPosition({ x: e.clientX, y: e.clientY })
        lastPos.current = { x: e.clientX, y: e.clientY }
        isInitialized.current = true
        
        // Remove this one-time listener
        window.removeEventListener('mousemove', initializeCursor)
      }
    }
    
    window.addEventListener('mousemove', initializeCursor, { once: true })
    
    const updatePosition = (e: MouseEvent) => {
      lastPos.current = position
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      
      const isInteractive = e.target.matches('a, button, [role="button"], [data-hoverable]') ||
        e.target.closest('a, button, [role="button"], [data-hoverable]') !== null
      
      if (isInteractive) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      
      const isInteractive = e.target.matches('a, button, [role="button"], [data-hoverable]') ||
        e.target.closest('a, button, [role="button"], [data-hoverable]') !== null
      
      if (isInteractive) {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    // Hide default cursor
    document.body.classList.add('custom-cursor-active')
    
    // Ensure cursor is visible right away
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '1'
    }
    
    // Add event listeners
    window.addEventListener('mousemove', updatePosition, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mousemove', initializeCursor)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [position])

  // Use requestAnimationFrame for smoother cursor movement
  useEffect(() => {
    const animateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`
      }
      
      // Animate trails with slight delay for each
      trailsRef.current.forEach((trail, i) => {
        if (!trail) return
        
        trail.style.transform = `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${1 - i * 0.15})`
        trail.style.opacity = String((1 - i * 0.2) * (isHovering ? 0.3 : 0.15))
      })
      
      frameRef.current = requestAnimationFrame(animateCursor)
    }
    
    frameRef.current = requestAnimationFrame(animateCursor)
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [position, isHovering])

  // Create trail elements
  const trails = Array(5).fill(0).map((_, i) => (
    <div
      key={i}
      ref={el => {
        if (el) trailsRef.current[i] = el
      }}
      className="fixed pointer-events-none cursor-trail"
      style={{
        width: '40px',
        height: '40px',
        zIndex: 9998 - i,
        opacity: 0, // Start invisible
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 32L8 8L32 20L20 22L12 32Z"
          fill={isClicking ? '#FFCC00' : 'white'}
          stroke="black"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  ))

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          willChange: 'transform',
          // Start with full opacity and high visibility
          opacity: 1,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `translate(-50%, -50%) scale(${isHovering ? 1.2 : 1}) ${isClicking ? 'scale(0.9)' : ''}`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* GTA-style cursor with better visibility */}
          <g>
            {/* Black outline for better visibility */}
            <path
              d="M12 32L8 8L32 20L20 22L12 32Z"
              fill="black"
              stroke="black"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Main cursor shape */}
            <path
              d="M12 32L8 8L32 20L20 22L12 32Z"
              fill={isClicking ? '#FFCC00' : 'white'}
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner highlight for 3D effect */}
            <path
              d="M10 20L20 22L16 16Z"
              fill={isClicking ? '#FFE066' : '#FFFFFF'}
              fillOpacity="0.5"
            />
          </g>
        </svg>
      </div>

      {/* Trails */}
      {trails}
    </>
  )
}