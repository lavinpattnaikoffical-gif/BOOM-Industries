import { useEffect, useRef, useCallback } from 'react';

// ── Burst pattern types ──
type BurstType = 'peony' | 'chrysanthemum' | 'willow' | 'palm' | 'ring' | 'crackle' | 'double';

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
  gravity: number;
  trail: boolean;
  sparkle: boolean;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  vx: number;
  exploded: boolean;
  particles: Particle[];
  trailParticles: Particle[];
  color: string;
  secondaryColor: string;
  burstType: BurstType;
  hasSecondary: boolean;
  secondaryTimer: number;
  secondaryDone: boolean;
}

// ── Color palettes for each firework ──
const PALETTES = [
  { primary: [40, 95, 65], secondary: [50, 90, 70] },     // Gold → Bright Gold
  { primary: [330, 90, 60], secondary: [340, 85, 75] },    // Magenta → Pink
  { primary: [220, 80, 60], secondary: [200, 85, 70] },    // Blue → Cyan
  { primary: [15, 90, 55], secondary: [30, 95, 65] },      // Orange → Gold
  { primary: [0, 85, 55], secondary: [20, 90, 65] },       // Red → Orange
  { primary: [280, 70, 60], secondary: [300, 75, 70] },    // Purple → Violet
  { primary: [120, 60, 50], secondary: [80, 70, 60] },     // Green → Lime
  { primary: [45, 100, 60], secondary: [35, 100, 70] },    // Amber → Light Amber
];

const BURST_TYPES: BurstType[] = ['peony', 'chrysanthemum', 'willow', 'palm', 'ring', 'crackle', 'double'];

function hsl(h: number, s: number, l: number, a: number) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const lastSpawnRef = useRef(0);

  const spawnFirework = useCallback((canvasW: number, canvasH: number) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const burstType = BURST_TYPES[Math.floor(Math.random() * BURST_TYPES.length)];
    const [ph, ps, pl] = palette.primary;
    const [sh, ss, sl] = palette.secondary;

    const startX = Math.random() * canvasW * 0.7 + canvasW * 0.15;
    const drift = (Math.random() - 0.5) * 1.5;

    fireworksRef.current.push({
      x: startX,
      y: canvasH + 10,
      targetY: Math.random() * canvasH * 0.35 + canvasH * 0.08,
      vy: -(10 + Math.random() * 5),
      vx: drift,
      exploded: false,
      particles: [],
      trailParticles: [],
      color: `${ph},${ps},${pl}`,
      secondaryColor: `${sh},${ss},${sl}`,
      burstType,
      hasSecondary: burstType === 'double' || Math.random() > 0.7,
      secondaryTimer: 15 + Math.floor(Math.random() * 10),
      secondaryDone: false,
    });
  }, []);

  const explode = useCallback((fw: Firework) => {
    const [h, s, l] = fw.color.split(',').map(Number);
    const [h2, s2, l2] = fw.secondaryColor.split(',').map(Number);

    const addParticle = (
      angle: number,
      speed: number,
      life: number,
      ch: number, cs: number, cl: number,
      sizeBase: number,
      decay: number,
      gravity: number,
      trail: boolean,
      sparkle: boolean,
    ) => {
      fw.particles.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.5,
        life,
        maxLife: life,
        color: `${ch},${cs},${cl}`,
        size: sizeBase + Math.random() * 1.2,
        decay,
        gravity,
        trail,
        sparkle,
      });
    };

    switch (fw.burstType) {
      case 'peony': {
        // Classic spherical burst — dense, round
        const count = 80 + Math.floor(Math.random() * 30);
        for (let i = 0; i < count; i++) {
          const angle = Math.PI * 2 * (i / count) + (Math.random() - 0.5) * 0.2;
          const speed = 2.5 + Math.random() * 3.5;
          const life = 45 + Math.random() * 25;
          addParticle(angle, speed, life, h, s, l, 2, 0.975, 0.025, false, false);
        }
        break;
      }
      case 'chrysanthemum': {
        // Long trailing tendrils
        const count = 100 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
          const angle = Math.PI * 2 * (i / count) + (Math.random() - 0.5) * 0.15;
          const speed = 3 + Math.random() * 4;
          const life = 60 + Math.random() * 35;
          addParticle(angle, speed, life, h, s, l, 1.8, 0.985, 0.018, true, false);
        }
        break;
      }
      case 'willow': {
        // Heavy gravity, drooping trails
        const count = 70 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
          const angle = Math.PI * 2 * (i / count) + (Math.random() - 0.5) * 0.25;
          const speed = 2 + Math.random() * 3;
          const life = 80 + Math.random() * 40;
          addParticle(angle, speed, life, h, s, Math.min(l + 15, 85), 1.5, 0.99, 0.04, true, false);
        }
        break;
      }
      case 'palm': {
        // Fan-shaped upward burst
        const count = 50 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI * 0.8 + (Math.PI * 0.6 * i) / count + (Math.random() - 0.5) * 0.3;
          const speed = 3 + Math.random() * 4;
          const life = 55 + Math.random() * 30;
          addParticle(angle, speed, life, h, s, l, 2.2, 0.98, 0.035, true, false);
        }
        break;
      }
      case 'ring': {
        // Perfect ring shape with inner sparkles
        const count = 60;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const speed = 3.5 + Math.random() * 0.5;
          const life = 40 + Math.random() * 15;
          addParticle(angle, speed, life, h, s, l, 2.5, 0.97, 0.02, false, false);
        }
        // Inner sparkles
        for (let i = 0; i < 25; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.5;
          const life = 30 + Math.random() * 20;
          addParticle(angle, speed, life, h2, s2, l2, 1, 0.96, 0.015, false, true);
        }
        break;
      }
      case 'crackle': {
        // Initial burst then sparkling crackle particles
        const count = 40;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 3;
          const life = 35 + Math.random() * 20;
          addParticle(angle, speed, life, h, s, l, 1.5, 0.97, 0.025, false, true);
        }
        // Extra sparkle burst
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2.5;
          const life = 50 + Math.random() * 30;
          addParticle(angle, speed, life, 45, 100, 80, 1, 0.98, 0.02, false, true);
        }
        break;
      }
      case 'double': {
        // Two concentric rings
        const outerCount = 60;
        for (let i = 0; i < outerCount; i++) {
          const angle = (Math.PI * 2 * i) / outerCount;
          const speed = 4 + Math.random() * 1;
          const life = 50 + Math.random() * 20;
          addParticle(angle, speed, life, h, s, l, 2, 0.975, 0.022, false, false);
        }
        const innerCount = 40;
        for (let i = 0; i < innerCount; i++) {
          const angle = (Math.PI * 2 * i) / innerCount;
          const speed = 1.5 + Math.random() * 1;
          const life = 40 + Math.random() * 15;
          addParticle(angle, speed, life, h2, s2, l2, 1.8, 0.97, 0.02, false, false);
        }
        break;
      }
    }

    fw.exploded = true;
  }, []);

  const spawnSecondary = useCallback((fw: Firework) => {
    const [h2, s2, l2] = fw.secondaryColor.split(',').map(Number);
    // Pick random living particles as secondary burst centers
    const aliveParticles = fw.particles.filter(p => p.life > p.maxLife * 0.3);
    const centers = aliveParticles
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 4));

    centers.forEach(center => {
      const count = 8 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 1.5;
        const life = 20 + Math.random() * 15;
        fw.particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: `${h2},${s2},${Math.min(l2 + 10, 90)}`,
          size: 1 + Math.random(),
          decay: 0.96,
          gravity: 0.02,
          trail: false,
          sparkle: true,
        });
      }
    });
    fw.secondaryDone = true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (time: number) => {
      // Fade trail — creates light persistence
      ctx.fillStyle = 'rgba(7, 7, 15, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new fireworks
      if (time - lastSpawnRef.current > 500 + Math.random() * 700) {
        spawnFirework(canvas.width, canvas.height);
        if (Math.random() > 0.4) {
          setTimeout(() => spawnFirework(canvas.width, canvas.height), 100 + Math.random() * 200);
        }
        if (Math.random() > 0.75) {
          setTimeout(() => spawnFirework(canvas.width, canvas.height), 250 + Math.random() * 300);
        }
        lastSpawnRef.current = time;
      }

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (!fw.exploded) {
          // ── Rising rocket ──
          fw.y += fw.vy;
          fw.x += fw.vx;
          fw.vy += 0.05;

          // Bright rocket head
          const rocketGlow = 6;
          const [rh, rs, rl] = fw.color.split(',').map(Number);
          const gradient = ctx.createRadialGradient(fw.x, fw.y, 0, fw.x, fw.y, rocketGlow);
          gradient.addColorStop(0, hsl(rh, rs, 95, 1));
          gradient.addColorStop(0.3, hsl(rh, rs, rl + 20, 0.8));
          gradient.addColorStop(1, hsl(rh, rs, rl, 0));
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, rocketGlow, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Dense trail behind rocket
          for (let t = 0; t < 4; t++) {
            fw.trailParticles.push({
              x: fw.x + (Math.random() - 0.5) * 3,
              y: fw.y + Math.random() * 4,
              vx: (Math.random() - 0.5) * 0.8,
              vy: 0.5 + Math.random() * 2,
              life: 18 + Math.random() * 10,
              maxLife: 28,
              color: fw.color,
              size: 1 + Math.random() * 1.5,
              decay: 0.95,
              gravity: 0.01,
              trail: false,
              sparkle: Math.random() > 0.6,
            });
          }

          if (fw.y <= fw.targetY) {
            explode(fw);
          }
        }

        // ── Trail particles ──
        fw.trailParticles = fw.trailParticles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.decay;
          p.life--;
          const alpha = p.life / p.maxLife;
          const [ph, ps, pl] = p.color.split(',').map(Number);

          if (p.sparkle && Math.random() > 0.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = hsl(ph, ps, Math.min(pl + 30, 95), alpha * 0.8);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fillStyle = hsl(ph, ps, pl, alpha * 0.7);
          ctx.fill();
          return p.life > 0;
        });

        // ── Secondary burst timer ──
        if (fw.exploded && fw.hasSecondary && !fw.secondaryDone) {
          fw.secondaryTimer--;
          if (fw.secondaryTimer <= 0) {
            spawnSecondary(fw);
          }
        }

        // ── Explosion particles ──
        fw.particles = fw.particles.filter((p) => {
          p.vx *= p.decay;
          p.vy *= p.decay;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          const alpha = p.life / p.maxLife;
          const [ph, ps, pl] = p.color.split(',').map(Number);

          // Trail effect — draw faded copies behind
          if (p.trail && alpha > 0.2) {
            for (let t = 1; t <= 3; t++) {
              const tx = p.x - p.vx * t * 1.5;
              const ty = p.y - p.vy * t * 1.5;
              const ta = alpha * (0.3 / t);
              ctx.beginPath();
              ctx.arc(tx, ty, p.size * alpha * 0.7, 0, Math.PI * 2);
              ctx.fillStyle = hsl(ph, ps, pl, ta);
              ctx.fill();
            }
          }

          // Sparkle flicker
          if (p.sparkle) {
            const flicker = Math.sin(p.life * 0.8) * 0.5 + 0.5;
            const sparkleSize = p.size * alpha * (0.5 + flicker * 1.5);
            ctx.beginPath();
            ctx.arc(p.x, p.y, sparkleSize, 0, Math.PI * 2);
            ctx.fillStyle = hsl(ph, Math.min(ps + 10, 100), Math.min(pl + 20, 95), alpha * flicker);
            ctx.fill();
          }

          // Main particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fillStyle = hsl(ph, ps, pl, alpha);
          ctx.fill();

          // Glow halo for brighter particles
          if (alpha > 0.25) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3.5 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = hsl(ph, ps, Math.min(pl + 10, 85), alpha * 0.12);
            ctx.fill();
          }

          // Bright core for fresh particles
          if (alpha > 0.7) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = hsl(ph, ps - 20, Math.min(pl + 35, 98), alpha);
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
  }, [spawnFirework, explode, spawnSecondary]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
