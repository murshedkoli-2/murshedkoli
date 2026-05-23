'use client'

import { useEffect, useRef, useState } from 'react'

// Pure canvas-based ultra-minimalist slow drift particle system
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Clean, sparse point drifting silently in the background
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulsePhase: number
      pulseSpeed: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 0.8 + 0.3 // Extremely tiny dot
        this.speedX = (Math.random() - 0.5) * 0.05 // Almost static, very slow
        this.speedY = (Math.random() - 0.5) * 0.05
        this.opacity = Math.random() * 0.15 + 0.05 // Highly transparent
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = Math.random() * 0.005 + 0.002
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around canvas
        if (this.x < 0) this.x = canvas!.width
        if (this.x > canvas!.width) this.x = 0
        if (this.y < 0) this.y = canvas!.height
        if (this.y > canvas!.height) this.y = 0

        // Slow breathing opacity
        this.pulsePhase += this.pulseSpeed
      }

      draw(ctx: CanvasRenderingContext2D) {
        const currentOpacity = this.opacity * (Math.sin(this.pulsePhase) * 0.3 + 0.7)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      // Sparse particle density: one dot per 30,000 pixels
      const particleCount = Math.min(45, Math.floor((canvas.width * canvas.height) / 30000))
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden grainy-bg pointer-events-none">
      {/* Sleek Matte base */}
      <div className="absolute inset-0 bg-[#050507]" />
      
      {/* Subtle fine lines grid */}
      <div className="absolute inset-0 opacity-[0.02] minimal-grid" />

      {/* Canvas for fine quiet points */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.8 }}
      />

      {/* Ultra-soft ambient center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />
    </div>
  )
}

export default ParticleBackground
