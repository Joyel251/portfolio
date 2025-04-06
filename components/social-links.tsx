"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa'
import anime from 'animejs'

interface SocialLink {
  icon: JSX.Element
  href: string
  label: string
  color: string
}

const socialLinks: SocialLink[] = [
  {
    icon: <FaGithub className="w-6 h-6" />,
    href: "https://github.com/yourusername",
    label: "GitHub",
    color: "#333"
  },
  {
    icon: <FaLinkedin className="w-6 h-6" />,
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
    color: "#0077b5"
  },
  {
    icon: <FaInstagram className="w-6 h-6" />,
    href: "https://instagram.com/yourusername",
    label: "Instagram",
    color: "#e4405f"
  },
  {
    icon: <FaEnvelope className="w-6 h-6" />,
    href: "mailto:your.email@example.com",
    label: "Email",
    color: "#ea4335"
  }
]

export default function SocialLinks() {
  const [isRevealed, setIsRevealed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isRevealed && containerRef.current) {
      // Container reveal animation
      anime({
        targets: containerRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, 0.8)'
      })

      // Icons staggered animation
      anime({
        targets: '.social-icon',
        translateX: [-50, 0],
        opacity: [0, 1],
        scale: [0.8, 1],
        rotateZ: [-15, 0],
        delay: anime.stagger(120),
        duration: 1200,
        easing: 'easeOutElastic(1, 0.6)'
      })

      // Icon glow effect
      anime({
        targets: '.social-icon svg',
        filter: ['blur(8px)', 'blur(0px)'],
        scale: [1.2, 1],
        opacity: [0, 1],
        delay: anime.stagger(150),
        duration: 800,
        easing: 'easeOutExpo'
      })
    }
  }, [isRevealed])

  // Enhanced button animation
  const animateButton = () => {
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        scale: [1, 1.2, 1],
        rotate: [0, isRevealed ? -180 : 180],
        duration: 800,
        easing: 'easeOutElastic(1, 0.5)',
        complete: () => {
          anime({
            targets: buttonRef.current,
            boxShadow: [
              '0 0 0 rgba(255,255,255,0.2)',
              '0 0 20px rgba(255,255,255,0.4)',
              '0 0 0 rgba(255,255,255,0.2)'
            ],
            duration: 1200,
            easing: 'easeOutExpo'
          })
        }
      })
    }
  }

  return (
    <div className="fixed left-8 bottom-8 z-40">
      <AnimatePresence mode="wait">
        {isRevealed && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="glass p-4 rounded-lg mb-4 backdrop-blur-md border border-white/10"
          >
            <div className="flex flex-col space-y-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon flex items-center space-x-3 p-2 rounded-md transition-all duration-300 hover:bg-white/10 group relative overflow-hidden"
                  style={{ opacity: 0 }}
                  whileHover={{
                    x: 10,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20"
                    style={{ backgroundColor: link.color }}
                    initial={false}
                    animate={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="relative z-10 text-white/80 group-hover:text-white transition-colors duration-300"
                    style={{ color: link.color }}
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {link.icon}
                  </motion.div>
                  <span className="relative z-10 text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={() => {
          setIsRevealed(!isRevealed)
          animateButton()
        }}
        className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg transition-all duration-300 border border-white/10"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 20px rgba(255,255,255,0.2)"
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <path d="M18 15l-6-6-6 6"/>
        </motion.svg>
      </motion.button>
    </div>
  )
} 