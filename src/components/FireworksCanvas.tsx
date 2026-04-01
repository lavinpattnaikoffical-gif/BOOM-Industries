import { useEffect, useRef } from 'react';

// Realistic fireworks animation with proper physics and visual effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: { h: number; s: number; l: number };
  size: number;
  decay: number;
  gravity: number;
  brightness: number;
  type: 'spark' | 'trail' | 'glow';
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  hue: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Explosion {
  x: number;
  y: number;
  particles: Particle[];
  hue: number;
  age: number;
  type: 'peony' | 'dahlia' | 'willow' | 'palm' | 'crossette' | 'kamuro';
}

// Vibrant firework colors
const FIREWORK_HUES = [
  0,    // Red
  30,   // Orange  
  45,   // Gold
  120,  // Green
  200,  // Blue
  280,  // Purple
  330,  // Pink/Magenta
];

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1));
}

function hslToString(h: number, s: number, l: number, a: number): string {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rockets = useRef<Rocket[]>([]);
  const explosions = useRef<Explosion[]>([]);
  const animationId = useRef<number>(0);
  const lastLaunch = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Launch a new rocket
    const launchRocket = () => {
      const hue = FIREWORK_HUES[randomInt(0, FIREWORK_HUES.length - 1)];
      rockets.current.push({
        x: random(canvas.width * 0.1, canvas.width * 0.9),
        y: canvas.height + 10,
        vx: random(-1, 1),
        vy: random(-14, -10),
        targetY: random(canvas.height * 0.1, canvas.height * 0.35),
        hue,
        trail: [],
      });
    };

    // Create explosion at position
    const createExplosion = (x: number, y: number, hue: number) => {
      const types: Explosion['type'][] = ['peony', 'dahlia', 'willow', 'palm', 'crossette', 'kamuro'];
      const type = types[randomInt(0, types.length - 1)];
      const particles: Particle[] = [];
      
      // Different explosion patterns
      switch (type) {
        case 'peony': {
          // Classic spherical burst
          const count = randomInt(80, 120);
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + random(-0.1, 0.1);
            const speed = random(2, 6);
            const colorVariation = random(-15, 15);
            particles.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: hue + colorVariation, s: 100, l: random(55, 70) },
              size: random(2, 3.5),
              decay: random(0.015, 0.02),
              gravity: 0.05,
              brightness: 1,
              type: 'spark',
            });
          }
          break;
        }
        case 'dahlia': {
          // Dense center with long streaks
          const streakCount = randomInt(12, 18);
          for (let i = 0; i < streakCount; i++) {
            const baseAngle = (Math.PI * 2 * i) / streakCount;
            // Multiple particles per streak
            for (let j = 0; j < 8; j++) {
              const speed = 1 + j * 0.6;
              particles.push({
                x, y,
                vx: Math.cos(baseAngle) * speed,
                vy: Math.sin(baseAngle) * speed,
                alpha: 1,
                color: { h: hue, s: 100, l: 60 + j * 3 },
                size: 3 - j * 0.2,
                decay: 0.012,
                gravity: 0.03,
                brightness: 1 - j * 0.08,
                type: 'spark',
              });
            }
          }
          // Add sparkle center
          for (let i = 0; i < 30; i++) {
            const angle = random(0, Math.PI * 2);
            const speed = random(0.5, 2);
            particles.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: hue + 30, s: 80, l: 80 },
              size: random(1, 2),
              decay: 0.025,
              gravity: 0.02,
              brightness: random(0.8, 1),
              type: 'glow',
            });
          }
          break;
        }
        case 'willow': {
          // Long drooping trails like a willow tree
          const count = randomInt(60, 80);
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + random(-0.05, 0.05);
            const speed = random(2, 4);
            particles.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: 45, s: 100, l: 70 }, // Golden willow
              size: random(1.5, 2.5),
              decay: 0.006, // Very slow decay for long trails
              gravity: 0.08, // Heavy gravity for drooping effect
              brightness: 1,
              type: 'trail',
            });
          }
          break;
        }
        case 'palm': {
          // Palm tree shape - upward burst with drooping ends
          const fronds = randomInt(8, 12);
          for (let i = 0; i < fronds; i++) {
            const baseAngle = -Math.PI / 2 + random(-0.8, 0.8); // Mostly upward
            for (let j = 0; j < 12; j++) {
              const speed = 2 + j * 0.4;
              const spread = j * 0.03;
              particles.push({
                x, y,
                vx: Math.cos(baseAngle + random(-spread, spread)) * speed,
                vy: Math.sin(baseAngle + random(-spread, spread)) * speed,
                alpha: 1,
                color: { h: hue, s: 100, l: 55 + j * 2 },
                size: random(2, 3),
                decay: 0.01,
                gravity: 0.06 + j * 0.005,
                brightness: 1 - j * 0.05,
                type: 'trail',
              });
            }
          }
          break;
        }
        case 'crossette': {
          // Bursts that split into smaller bursts
          const mainCount = randomInt(20, 30);
          for (let i = 0; i < mainCount; i++) {
            const angle = (Math.PI * 2 * i) / mainCount;
            const speed = random(3, 5);
            particles.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: hue, s: 100, l: 65 },
              size: random(2.5, 4),
              decay: 0.02,
              gravity: 0.04,
              brightness: 1,
              type: 'spark',
            });
          }
          // Secondary smaller bursts
          for (let i = 0; i < 40; i++) {
            const angle = random(0, Math.PI * 2);
            const speed = random(1, 3);
            particles.push({
              x: x + random(-20, 20),
              y: y + random(-20, 20),
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: hue + 180, s: 100, l: 70 }, // Complementary color
              size: random(1, 2),
              decay: 0.018,
              gravity: 0.03,
              brightness: 1,
              type: 'glow',
            });
          }
          break;
        }
        case 'kamuro': {
          // Japanese-style dense golden cascade
          const count = randomInt(150, 200);
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + random(-0.2, 0.2);
            const speed = random(1, 5);
            particles.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: { h: 45, s: 100, l: random(60, 85) }, // Bright gold
              size: random(1, 2.5),
              decay: 0.008,
              gravity: 0.065,
              brightness: random(0.7, 1),
              type: 'trail',
            });
          }
          break;
        }
      }
      
      explosions.current.push({ x, y, particles, hue, age: 0, type });
    };

    // Main animation loop
    const animate = (time: number) => {
      // Create fade effect for trails
      ctx.fillStyle = 'rgba(14, 14, 19, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto-launch rockets
      if (time - lastLaunch.current > random(800, 1500)) {
        launchRocket();
        // Sometimes launch multiple
        if (Math.random() > 0.6) {
          setTimeout(launchRocket, random(100, 300));
        }
        lastLaunch.current = time;
      }

      // Update and draw rockets
      rockets.current = rockets.current.filter(rocket => {
        // Update position
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.04; // Gravity

        // Add to trail
        rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1 });
        if (rocket.trail.length > 20) {
          rocket.trail.shift();
        }

        // Draw trail
        rocket.trail.forEach((point, i) => {
          const alpha = (i / rocket.trail.length) * point.alpha * 0.6;
          const size = 1 + (i / rocket.trail.length) * 2;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = hslToString(rocket.hue, 100, 70, alpha);
          ctx.fill();
          point.alpha *= 0.95;
        });

        // Draw rocket head with glow
        const gradient = ctx.createRadialGradient(
          rocket.x, rocket.y, 0,
          rocket.x, rocket.y, 12
        );
        gradient.addColorStop(0, hslToString(rocket.hue, 100, 95, 1));
        gradient.addColorStop(0.3, hslToString(rocket.hue, 100, 70, 0.8));
        gradient.addColorStop(1, hslToString(rocket.hue, 100, 50, 0));
        
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Check if should explode
        if (rocket.vy >= 0 || rocket.y <= rocket.targetY) {
          // Create flash effect
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = hslToString(rocket.hue, 100, 80, 1);
          ctx.beginPath();
          ctx.arc(rocket.x, rocket.y, 100, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          
          createExplosion(rocket.x, rocket.y, rocket.hue);
          return false;
        }

        return true;
      });

      // Update and draw explosions
      explosions.current = explosions.current.filter(explosion => {
        explosion.age++;
        
        explosion.particles = explosion.particles.filter(p => {
          // Update physics
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.brightness *= 0.995;

          if (p.alpha <= 0) return false;

          const { h, s, l } = p.color;
          
          // Draw based on particle type
          if (p.type === 'trail' && p.alpha > 0.1) {
            // Draw motion trail
            for (let i = 1; i <= 4; i++) {
              const trailX = p.x - p.vx * i * 1.5;
              const trailY = p.y - p.vy * i * 1.5;
              const trailAlpha = p.alpha * (0.25 / i);
              ctx.beginPath();
              ctx.arc(trailX, trailY, p.size * 0.7, 0, Math.PI * 2);
              ctx.fillStyle = hslToString(h, s, l - 10, trailAlpha);
              ctx.fill();
            }
          }

          // Outer glow
          if (p.brightness > 0.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = hslToString(h, s, l, p.alpha * 0.15);
            ctx.fill();
          }

          // Main particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = hslToString(h, s, l * p.brightness, p.alpha);
          ctx.fill();

          // Bright center for fresh particles
          if (p.alpha > 0.6) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = hslToString(h, s - 20, Math.min(l + 25, 95), p.alpha);
            ctx.fill();
          }

          // Sparkle effect for glow type
          if (p.type === 'glow' && Math.random() > 0.7) {
            const sparkleSize = p.size * random(0.5, 1.5);
            ctx.beginPath();
            ctx.arc(p.x, p.y, sparkleSize, 0, Math.PI * 2);
            ctx.fillStyle = hslToString(h, s, 90, p.alpha * random(0.5, 1));
            ctx.fill();
          }

          return true;
        });

        return explosion.particles.length > 0;
      });

      animationId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationId.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
