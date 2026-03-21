import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function getNextDiwali(): Date {
  const now = new Date();
  const diwali2026 = new Date(2026, 9, 19);
  const diwali2027 = new Date(2027, 10, 8);
  return now < diwali2026 ? diwali2026 : diwali2027;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const unitColors = ['#f7ca43', '#ff64bc', '#7eafff', '#22c55e'];

function CountdownBlock({ value, label, color }: { value: number; label: string; color: string }) {
  const prevRef = useRef(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 350);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className="glass-card rounded-2xl p-6 md:p-8 text-center"
      style={{
        minWidth: '110px',
        border: `1px solid ${color}22`,
        boxShadow: `0 0 40px ${color}10`,
      }}
    >
      <div
        className="font-display font-bold tabular-nums"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color,
          filter: `drop-shadow(0 0 16px ${color}60)`,
          animation: animate ? 'ticker-in 0.35s ease' : 'none',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        className="text-xs font-body mt-2 tracking-widest uppercase"
        style={{ color: 'rgba(171,170,183,0.7)' }}
      >
        {label}
      </div>
    </div>
  );
}

export default function CountdownSection() {
  const ref = useScrollReveal();
  const [target] = useState(getNextDiwali);
  const [time, setTime] = useState(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: 'rgba(247,202,67,0.05)' }}
        />
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ background: 'rgba(255,100,188,0.04)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full blur-3xl"
          style={{ background: 'rgba(126,175,255,0.04)' }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="reveal">
          <span
            className="text-xs font-body tracking-widest uppercase"
            style={{ color: '#7eafff' }}
          >
            Mark Your Calendar
          </span>
          <h2
            className="font-display font-bold mt-3 mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#f1effd' }}
          >
            Next Diwali{' '}
            <span className="glow-text-multi italic">Countdown</span>
          </h2>
          <p
            className="font-body mb-12"
            style={{ color: 'rgba(171,170,183,0.85)' }}
          >
            The festival of lights awaits. Prepare for a celebration like no other.
          </p>
        </div>

        <div className="reveal flex flex-wrap justify-center gap-4 md:gap-6">
          {units.map((u, i) => (
            <CountdownBlock
              key={u.label}
              value={u.value}
              label={u.label}
              color={unitColors[i]}
            />
          ))}
        </div>

        {/* Separator dots */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-0 mb-0" style={{ pointerEvents: 'none' }}>
          {/* Just decorative colons handled inside CountdownBlock spacing */}
        </div>

        <div className="reveal mt-12">
          <p
            className="text-sm font-body"
            style={{ color: 'rgba(171,170,183,0.5)' }}
          >
            🎆 Stock up early — demand surges close to Diwali
          </p>
        </div>
      </div>
    </section>
  );
}
