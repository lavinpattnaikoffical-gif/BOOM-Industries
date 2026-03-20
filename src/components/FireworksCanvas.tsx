import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  decay: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  particles: Particle[];
  trailParticles: Particle[];
  color: string;
}

const COLORS = [
  'hsla(40, 95%, 60%, ',
  'hsla(330, 90%, 60%, ',
  'hsla(220, 80%, 60%, ',
  'hsla(15, 90%, 55%, ',
  'hsla(50, 95%, 70%, ',
  'hsla(280, 70%, 60%, ',
];

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let fireworks: Firework[] = [];
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnFirework = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      fireworks.push({
        x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: canvas.height,
        targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
        vy: -(8 + Math.random() * 4),
        exploded: false,
        particles: [],
        trailParticles: [],
        color,
      });
    };

    const explode = (fw: Firework) => {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 4;
        const life = 40 + Math.random() * 30;
        fw.particles.push({
          x: fw.x,
          y: fw.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: fw.color,
          size: 1.5 + Math.random() * 1.5,
          decay: 0.97,
        });
      }
      fw.exploded = true;
    };

    const loop = (time: number) => {
      ctx.fillStyle = 'rgba(7, 7, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (time - lastSpawn > 600 + Math.random() * 800) {
        spawnFirework();
        if (Math.random() > 0.5) spawnFirework();
        lastSpawn = time;
      }

      fireworks = fireworks.filter((fw) => {
        if (!fw.exploded) {
          // Trail
          fw.trailParticles.push({
            x: fw.x + (Math.random() - 0.5) * 2,
            y: fw.y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 1.5,
            life: 15,
            maxLife: 15,
            color: fw.color,
            size: 1.5,
            decay: 0.95,
          });

          fw.y += fw.vy;
          fw.vy += 0.04;

          if (fw.y <= fw.targetY) {
            explode(fw);
          }

          // Draw rocket
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = fw.color + '1)';
          ctx.fill();
        }

        // Draw trail particles
        fw.trailParticles = fw.trailParticles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          const alpha = p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.6) + ')';
          ctx.fill();
          return p.life > 0;
        });

        // Draw explosion particles
        fw.particles = fw.particles.filter((p) => {
          p.vx *= p.decay;
          p.vy *= p.decay;
          p.vy += 0.02;
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          const alpha = p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fillStyle = p.color + alpha + ')';
          ctx.fill();

          // Glow
          if (alpha > 0.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = p.color + (alpha * 0.15) + ')';
            ctx.fill();
          }
          return p.life > 0;
        });

        return !fw.exploded || fw.particles.length > 0 || fw.trailParticles.length > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
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
