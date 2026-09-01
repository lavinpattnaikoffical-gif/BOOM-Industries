import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const SPARK_COLORS = [
  'hsla(40, 95%, 65%, ',
  'hsla(330, 85%, 60%, ',
  'hsla(50, 90%, 70%, ',
  'hsla(15, 85%, 55%, ',
];

export default function SparkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Disable on touch devices to conserve resources
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let sparks: Spark[] = [];
    let isRunning = false;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const loop = () => {
      if (sparks.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08;
        s.vx *= 0.98;
        s.life--;
        const alpha = Math.max(0, s.life / s.maxLife);
        const size = alpha * 2.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha + ')';
        ctx.fill();
        return s.life > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * 2.8,
          vy: (Math.random() - 0.5) * 2.8 - 0.8,
          life: 18 + Math.random() * 14,
          maxLife: 32,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        });
      }

      // Limit max sparks pool
      if (sparks.length > 50) {
        sparks.splice(0, sparks.length - 50);
      }

      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
