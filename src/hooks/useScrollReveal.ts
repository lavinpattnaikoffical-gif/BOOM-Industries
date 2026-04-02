import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Use MutationObserver to watch for dynamically added elements
    const mutationObserver = new MutationObserver(() => {
      const targets = el.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)');
      targets.forEach((t) => {
        if (!observer.takeRecords().some(r => r.target === t)) {
          observer.observe(t);
        }
      });
    });

    // Initial query for existing elements
    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    targets.forEach((t) => observer.observe(t));

    // Watch for new elements being added to the section
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return ref;
}
