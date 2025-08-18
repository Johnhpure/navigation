"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
}

interface ShootingStar {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  delay: number
  duration: number
}

export function AuroraBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const colors = [
      "oklch(0.65 0.25 264 / 0.3)", // Purple
      "oklch(0.7 0.2 180 / 0.3)", // Cyan
      "oklch(0.75 0.2 300 / 0.3)", // Magenta
      "oklch(0.8 0.15 60 / 0.3)", // Yellow
      "oklch(0.6 0.2 120 / 0.3)", // Green
    ]

    const newParticles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 6,
      })
    }
    setParticles(newParticles)

    const newShootingStars: ShootingStar[] = []
    for (let i = 0; i < 5; i++) {
      newShootingStars.push({
        id: i,
        startX: Math.random() * 100,
        startY: Math.random() * 50,
        endX: Math.random() * 100,
        endY: Math.random() * 50 + 50,
        delay: Math.random() * 10,
        duration: Math.random() * 3 + 2,
      })
    }
    setShootingStars(newShootingStars)
  }, [])

  return (
    <div className="aurora-bg">
      <div className="aurora-gradient" />
      <div className="aurora-rings">
        <div className="aurora-ring aurora-ring-1" />
        <div className="aurora-ring aurora-ring-2" />
        <div className="aurora-ring aurora-ring-3" />
      </div>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="aurora-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      {shootingStars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="shooting-star"
          style={
            {
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              "--end-x": `${star.endX - star.startX}vw`,
              "--end-y": `${star.endY - star.startY}vh`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
