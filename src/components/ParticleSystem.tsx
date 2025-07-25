import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number];
  trail: Array<{ x: number; y: number; life: number }>;
}

interface ParticleSystemProps {
  enabled: boolean;
  particleCount?: number;
  colors: [number[], number[], number[]];
  fractalCenter: [number, number];
  fractalZoom: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  enabled,
  particleCount = 50,
  colors,
  fractalCenter,
  fractalZoom
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticle = useCallback((): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return {
        x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1000,
        size: 1, color: [1, 1, 1], trail: []
      };
    }

    const colorIndex = Math.floor(Math.random() * colors.length);
    const baseColor = colors[colorIndex];
    
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 2000 + 1000,
      maxLife: Math.random() * 2000 + 1000,
      size: Math.random() * 3 + 1,
      color: [
        baseColor[0] + (Math.random() - 0.5) * 0.2,
        baseColor[1] + (Math.random() - 0.5) * 0.2,
        baseColor[2] + (Math.random() - 0.5) * 0.2
      ],
      trail: []
    };
  }, [colors]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const particles = particlesRef.current;
    
    // Update existing particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add to trail
      particle.trail.push({ x: particle.x, y: particle.y, life: particle.life });
      if (particle.trail.length > 10) {
        particle.trail.shift();
      }
      
      // Update trail life
      particle.trail.forEach(point => point.life -= 16);
      particle.trail = particle.trail.filter(point => point.life > 0);
      
      // Apply fractal-based force
      const dx = particle.x - canvas.width / 2;
      const dy = particle.y - canvas.height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = Math.sin(distance * 0.01 + Date.now() * 0.001) * 0.1;
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
      }
      
      // Apply damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Update life
      particle.life -= 16;
      
      // Remove dead particles
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    // Add new particles
    while (particles.length < particleCount) {
      particles.push(createParticle());
    }
  }, [enabled, particleCount, createParticle]);

  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      // Draw trail
      ctx.beginPath();
      particle.trail.forEach((point, index) => {
        const trailAlpha = (point.life / particle.maxLife) * alpha * 0.3;
        const size = particle.size * (index / particle.trail.length);
        
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = `rgb(${particle.color[0] * 255}, ${particle.color[1] * 255}, ${particle.color[2] * 255})`;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw particle
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${particle.color[0] * 255}, ${particle.color[1] * 255}, ${particle.color[2] * 255})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgb(${particle.color[0] * 255}, ${particle.color[1] * 255}, ${particle.color[2] * 255})`;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
    });
    
    ctx.globalAlpha = 1;
  }, [enabled]);

  const animate = useCallback(() => {
    if (!enabled) return;
    
    updateParticles();
    renderParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, updateParticles, renderParticles]);

  useEffect(() => {
    if (enabled) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleSystem;
