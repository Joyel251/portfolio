"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import dynamic from "next/dynamic"
import {
  ChevronDown,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Mail
} from "lucide-react"
import { Suspense } from "react"
import { FaGithub, FaLinkedin, FaInstagram as InstagramIcon } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

// Dynamically import heavy components
const ThreeScene = dynamic(() => import("@/components/three-scene"), { ssr: false })
const CustomCursor = dynamic(() => import("@/components/custom-cursor"), { ssr: false })
const DraggableName = dynamic(() => import("@/components/draggable-name"), { ssr: false })
const LoadingAnimation = dynamic(() => import("@/components/loading-animation"), { ssr: false })
const EnhancedClickAnimation = dynamic(() => import("@/components/enhanced-click-animation"), { ssr: false })
const AnimatedIcon = dynamic(() => import("@/components/animated-icon"), { ssr: false })
const SocialLinks = dynamic(() => import("@/components/social-links"), { ssr: false })

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  // For icon color change on click
  const [clickedIcon, setClickedIcon] = useState<string | null>(null)

  // Mouse position for parallax effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smoother parallax
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  // Transform values for parallax effects
  const mouseXHero = useTransform(mouseXSpring, [-1, 1], [-10, 10])
  const mouseYHero = useTransform(mouseYSpring, [-1, 1], [-5, 5])
  const mouseXHeroText = useTransform(mouseXSpring, [-1, 1], [-5, 5])
  const mouseYHeroText = useTransform(mouseYSpring, [-1, 1], [-5, 5])
  const mouseXHeroShapes = useTransform(mouseXSpring, [-1, 1], [-20, 20])
  const mouseYHeroShapes = useTransform(mouseYSpring, [-1, 1], [-20, 20])
  const mouseXAbout = useTransform(mouseXSpring, [-1, 1], [-5, 5])
  const mouseYAbout = useTransform(mouseYSpring, [-1, 1], [-5, 5])
  const mouseXSkills = useTransform(mouseXSpring, [-1, 1], [-5, 5])
  const mouseYSkills = useTransform(mouseYSpring, [-1, 1], [-2, 2])
  const mouseXConnect = useTransform(mouseXSpring, [-1, 1], [5, -5])
  const mouseYConnect = useTransform(mouseYSpring, [-1, 1], [-2, 2])

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1

      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Subtle parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Transform values for parallax effects - memoized to prevent recalculation
  const parallaxValues = useMemo(() => {
    return {
      mouseXHero: mouseXHero,
      mouseYHero: mouseYHero,
      mouseXHeroText: mouseXHeroText,
      mouseYHeroText: mouseYHeroText,
      mouseXHeroShapes: mouseXHeroShapes,
      mouseYHeroShapes: mouseYHeroShapes,
      mouseXAbout: mouseXAbout,
      mouseYAbout: mouseYAbout,
      mouseXSkills: mouseXSkills,
      mouseYSkills: mouseYSkills,
      mouseXConnect: mouseXConnect,
      mouseYConnect: mouseYConnect,
    }
  }, [
    mouseXHero,
    mouseYHero,
    mouseXHeroText,
    mouseYHeroText,
    mouseXHeroShapes,
    mouseYHeroShapes,
    mouseXAbout,
    mouseYAbout,
    mouseXSkills,
    mouseYSkills,
    mouseXConnect,
    mouseYConnect,
  ])

  // Track scroll position for section detection and scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // Update active section
      if (aboutRef.current && scrollPosition >= aboutRef.current.offsetTop) {
        setActiveSection("about")
      } else {
        setActiveSection("hero")
      }

      // Hide scroll indicator after scrolling
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle icon click to change color
  const handleIconClick = (iconName: string) => {
    setClickedIcon(iconName)
    setTimeout(() => setClickedIcon(null), 1000) // Reset after 1 second
  }

  if (!mounted) return null

  return (
    <main className="relative min-h-screen bg-[#030303] text-white">
      <CustomCursor />
      
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingAnimation onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10"
      >
        {/* Noise texture overlay */}
        <div className="noise fixed inset-0 z-0 pointer-events-none" />

        {/* Background Scene */}
        <div className="fixed inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Social Links */}
        <div className="relative z-20">
          <SocialLinks />
        </div>

        {/* Content Sections */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section ref={heroRef} className="relative flex h-screen w-full flex-col items-center justify-center px-4">
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{
                y,
                opacity,
                x: parallaxValues.mouseXHero,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="overflow-hidden mb-8"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  className="text-center elegant-accent text-sm italic tracking-widest md:text-base text-white/70 uppercase"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{
                    x: parallaxValues.mouseXHeroText,
                    y: parallaxValues.mouseYHeroText,
                  }}
                >
                  "Exploring the intersection of creativity and technology"
                </motion.p>
              </motion.div>

              <div className="relative">
                <motion.div
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  style={{
                    x: parallaxValues.mouseXHeroShapes,
                    y: parallaxValues.mouseYHeroShapes,
                  }}
                >
                  {/* Animated background shapes for the name */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <motion.div
                      className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/20"
                      animate={{
                        x: [0, 10, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 4,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/20"
                      animate={{
                        x: [0, -15, 0],
                        y: [0, 15, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: !isLoading ? "100%" : "0%" }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* 3D draggable name with monochrome theme */}
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: !isLoading ? 0 : 100, opacity: !isLoading ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                  <DraggableName
                    name="JOYEL IMMAMNUEL"
                    className="elegant-title text-center text-5xl font-medium tracking-wider md:text-7xl lg:text-8xl whitespace-nowrap text-shadow"
                  />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="relative h-0.5 w-0 mt-2"
                  initial={{ width: "0%" }}
                  animate={{ width: !isLoading ? "100%" : "0%" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: !isLoading ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: !isLoading ? 1 : 0 }}
                    transition={{ duration: 1.2, delay: 1.1 }}
                  />
                </motion.div>
              </div>

              <motion.div
                className="overflow-hidden mt-8"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  className="text-center text-sm elegant-text font-light tracking-widest md:text-base text-white/70 uppercase"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2 }}
                  style={{
                    x: parallaxValues.mouseXHeroText,
                    y: parallaxValues.mouseYHeroText,
                  }}
                >
                  <motion.span className="inline-block mx-1.5 hover:text-white transition-colors" whileHover={{ y: -3 }}>
                    UI UX Designer
                  </motion.span>
                  <span className="inline-block mx-1.5 text-white/40">•</span>
                  <motion.span className="inline-block mx-1.5 hover:text-white transition-colors" whileHover={{ y: -3 }}>
                    Web Developer
                  </motion.span>
                  <span className="inline-block mx-1.5 text-white/40">•</span>
                  <motion.span className="inline-block mx-1.5 hover:text-white transition-colors" whileHover={{ y: -3 }}>
                    Game Development
                  </motion.span>
                </motion.p>
              </motion.div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  x: parallaxValues.mouseXHeroText,
                  y: parallaxValues.mouseYHeroText,
                }}
              >
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <motion.button
                    className="px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 transition-colors elegant-accent tracking-wider uppercase relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={scrollToAbout}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/10 w-full"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Explore</span>
                  </motion.button>
                  <motion.a
                    href="mailto:joyelimmanuel.27csa@licet.ac.in"
                    className="px-6 py-2 bg-white text-black rounded-full text-sm hover:bg-white/90 transition-colors flex items-center justify-center elegant-accent tracking-wider uppercase relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-black/10 w-full"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <Mail className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Contact</span>
                  </motion.a>
                </div>
              </motion.div>

              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    className="absolute bottom-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 3, duration: 1 }}
                  >
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                      onClick={scrollToAbout}
                      className="cursor-pointer"
                    >
                      <ChevronDown className="w-6 h-6 text-white/70" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* About Section */}
          <section
            ref={aboutRef}
            className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 py-24"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                className="mb-16 text-center"
              >
                <motion.h2
                  className="elegant-title text-3xl md:text-4xl font-medium mb-4 text-white text-shadow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  About Me
                </motion.h2>
                <motion.div
                  className="h-0.5 w-20 bg-white/50 mx-auto mb-8"
                  whileHover={{ width: 100, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
                <motion.p
                  className="text-lg elegant-text text-white/80 leading-relaxed max-w-2xl mx-auto"
                  style={{
                    x: parallaxValues.mouseXAbout,
                    y: parallaxValues.mouseYAbout,
                  }}
                >
                  I'm a passionate creative developer with expertise in UI/UX design, web development, and game creation. I
                  blend technical skills with artistic vision to craft immersive digital experiences.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  style={{
                    x: parallaxValues.mouseXSkills,
                    y: parallaxValues.mouseYSkills,
                  }}
                >
                  <h3 className="tech-title text-xl font-medium mb-4 text-white">Skills & Expertise</h3>
                  <ul className="space-y-3 elegant-text text-white/80">
                    {[
                      "UI/UX Design & Prototyping",
                      "Frontend Development (React, Next.js)",
                      "3D Graphics & Visualization",
                      "Game Development & Interactive Media",
                    ].map((skill, index) => (
                      <motion.li
                        key={skill}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5, color: "#ffffff" }}
                      >
                        <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mt-16 text-center"
              >
                <motion.button
                  className="px-8 py-3 bg-white text-black rounded-full text-sm hover:bg-white/90 transition-colors group flex items-center elegant-accent tracking-wider uppercase relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <motion.span
                    className="absolute inset-0 bg-black/10 w-full"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Back to Top</span>
                  <motion.span
                    className="inline-block ml-2 relative z-10"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 90 }}
                    whileHover={{ y: -3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* Fixed navigation dots */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
            <div className="flex flex-col gap-4">
              <motion.button
                className={`w-3 h-3 rounded-full ${activeSection === "hero" ? "bg-white" : "bg-white/30"} transition-colors`}
                whileHover={{ scale: 1.5, backgroundColor: "#ffffff" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
              <motion.button
                className={`w-3 h-3 rounded-full ${activeSection === "about" ? "bg-white" : "bg-white/30"} transition-colors`}
                whileHover={{ scale: 1.5, backgroundColor: "#ffffff" }}
                onClick={scrollToAbout}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="relative py-6 text-center text-sm text-white/50 elegant-text">
            <p>Not yet completed still working on it</p>
          </footer>
        </div>
      </motion.div>
    </main>
  )
}

