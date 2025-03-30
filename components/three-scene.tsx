"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.035)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 15

    // Renderer setup - optimized
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 3000

    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere
      const radius = 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Create particle material
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uSize: { value: 15 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uInteracting: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform vec2 uMouse;
        uniform float uInteracting;
        
        attribute float size;
        
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          
          // Calculate distance to mouse
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Subtle movement
          float wave = sin(uTime * 0.3 + position.x * 0.2 + position.y * 0.1 + position.z * 0.1) * 0.1;
          mvPosition.x += wave;
          mvPosition.y += wave;
          
          // Mouse interaction
          if (uInteracting > 0.5) {
            vec2 mousePos = uMouse * 15.0;
            float dist = distance(position.xy, mousePos);
            if (dist < 5.0) {
              float strength = (5.0 - dist) * 0.2;
              vec2 direction = normalize(position.xy - mousePos);
              mvPosition.x += direction.x * strength;
              mvPosition.y += direction.y * strength;
            }
          }
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = uSize * size * uPixelRatio * (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        
        void main() {
          // Circular particle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Fade out edges
          float alpha = smoothstep(0.5, 0.3, dist);
          
          // White color with distance-based opacity
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Create connecting lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })

    const linesGeometry = new THREE.BufferGeometry()
    const linePositions: number[] = []
    const maxConnections = 1000
    let connectionCount = 0

    // Connect nearby particles
    for (let i = 0; i < particleCount && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < particleCount && connectionCount < maxConnections; j++) {
        const p1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
        const p2 = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])

        const distance = p1.distanceTo(p2)

        if (distance < 3 && Math.random() > 0.95) {
          linePositions.push(p1.x, p1.y, p1.z)
          linePositions.push(p2.x, p2.y, p2.z)
          connectionCount++
        }
      }
    }

    linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial)
    scene.add(lines)

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Mouse interaction
    const mouse = new THREE.Vector2()

    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.uMouse.value.x = mouse.x
        particlesMaterial.uniforms.uMouse.value.y = mouse.y
      }
    }

    const handleMouseDown = () => {
      setIsInteracting(true)
      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.uInteracting.value = 1.0
      }
    }

    const handleMouseUp = () => {
      setIsInteracting(false)
      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.uInteracting.value = 0.0
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)

      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio()
      }
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update uniforms
      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.uTime.value = elapsedTime
      }

      // Rotate scene slowly
      particles.rotation.y = elapsedTime * 0.05
      lines.rotation.y = elapsedTime * 0.05

      // Render
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("resize", handleResize)

      // Dispose resources
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      linesGeometry.dispose()
      linesMaterial.dispose()

      renderer.dispose()

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" style={{ cursor: isInteracting ? "grabbing" : "grab" }} />
}

