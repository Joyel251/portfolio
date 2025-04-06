"use client"

import { useEffect, useRef } from 'react'
import anime from 'animejs/lib/anime.es.js'

interface AnimatedIconProps {
  icon: React.ReactNode
  type?: 'github' | 'linkedin' | 'instagram' | 'email'
}

const brandColors = {
  github: '#333333',
  linkedin: '#0077B5',
  instagram: '#E4405F',
  email: '#EA4335',
  default: '#FFFFFF'
}

export default function AnimatedIcon({ icon, type = 'default' }: AnimatedIconProps) {
  const iconRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = iconRef.current
    const container = containerRef.current

    if (!element || !container) return

    const brandColor = brandColors[type] || brandColors.default
    let isNear = false
    let mouseX = 0
    let mouseY = 0
    let rafId: number

    // Reset animation when component mounts
    anime.set(element, {
      scale: 1,
      rotate: 0,
      opacity: 1,
      color: 'rgba(255, 255, 255, 0.8)'
    })

    const updateIconState = (e: MouseEvent) => {
      if (!element) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      mouseX = e.clientX
      mouseY = e.clientY

      const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))
      const maxDistance = 150 // Increased detection distance

      // Check if cursor is near the icon
      const isPointing = distance < maxDistance

      if (isPointing && !isNear) {
        isNear = true
        anime({
          targets: element,
          scale: 1.3,
          rotate: function() { return anime.random(-10, 10) },
          translateY: -2,
          color: brandColor,
          duration: 800,
          easing: 'spring(1, 90, 10, 0)'
        })
      } else if (!isPointing && isNear) {
        isNear = false
        anime({
          targets: element,
          scale: 1,
          rotate: 0,
          translateY: 0,
          translateX: 0,
          color: 'rgba(255, 255, 255, 0.8)',
          duration: 600,
          easing: 'spring(1, 90, 10, 0)'
        })
      }

      if (distance < maxDistance) {
        const scale = 1 + (1 - distance / maxDistance) * 0.3
        const deltaX = (mouseX - centerX) * 0.05
        const deltaY = (mouseY - centerY) * 0.05
        
        anime({
          targets: element,
          translateX: deltaX,
          translateY: deltaY,
          scale: isPointing ? scale * 1.1 : scale,
          duration: 800,
          easing: 'easeOutElastic(1, .6)'
        })
      }
    }

    const animate = () => {
      updateIconState({ clientX: mouseX, clientY: mouseY } as MouseEvent)
      rafId = requestAnimationFrame(animate)
    }

    // Add event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseDown = () => {
      anime({
        targets: element,
        scale: 0.9,
        rotate: function() { return anime.random(-15, 15) },
        duration: 150,
        color: brandColor,
        complete: () => {
          anime({
            targets: element,
            scale: 1.3,
            duration: 800,
            easing: 'spring(1, 90, 10, 0)'
          })
        }
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mousedown', handleMouseDown)
    rafId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mousedown', handleMouseDown)
    }
  }, [type])

  return (
    <div 
      className="relative w-8 h-8 flex items-center justify-center cursor-pointer" 
      data-hoverable 
      ref={containerRef}
    >
      <div 
        ref={iconRef}
        className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ 
          transformOrigin: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          willChange: 'transform, color'
        }}
      >
        {icon}
      </div>
    </div>
  )
} 