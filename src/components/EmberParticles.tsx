import { useMemo } from 'react';

export default function EmberParticles() {
  const embers = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.left}%`,
            bottom: '-10px',
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, hsla(40, 95%, 60%, ${e.opacity}), hsla(15, 90%, 50%, 0))`,
            animation: `float-ember ${e.duration}s ${e.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
