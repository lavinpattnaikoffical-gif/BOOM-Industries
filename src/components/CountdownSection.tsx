import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function getNextDiwali(): Date {
  // Approximate Diwali dates
  const now = new Date();
  const year = now.getFullYear();
  // Diwali 2026 is approx Oct 19
  const diwali2026 = new Date(2026, 9, 19);
  const diwali2027 = new Date(2027, 10, 8);
  return now < diwali2026 ? diwali2026 : diwali2027;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
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
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="reveal">
          <span className="text-xs font-body text-accent tracking-widest uppercase">Mark Your Calendar</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-3">
            Countdown to <span className="glow-text-multi">Diwali</span>
          </h2>
          <p className="text-muted-foreground font-body mb-12">
            The festival of lights awaits. Prepare for a celebration like no other.
          </p>
        </div>

        <div className="reveal flex flex-wrap justify-center gap-4 md:gap-6">
          {units.map((u) => (
            <div
              key={u.label}
              className="glass-card rounded-2xl p-6 md:p-8 min-w-[100px] md:min-w-[130px]"
            >
              <div className="font-display font-bold text-4xl md:text-5xl text-primary tabular-nums">
                {String(u.value).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground font-body mt-2 tracking-wider uppercase">
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
