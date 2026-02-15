'use client';
import { useEffect, useRef } from 'react';

export default function CounterAnimation({ end, duration = 2000, suffix = '', prefix = '' }) {
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = countRef.current;
    if (!element || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasAnimated.current = true;
          animateCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    function animateCounter() {
      const start = 0;
      const increment = end / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          element.textContent = prefix + end.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }
      }, 16);
    }

    return () => observer.disconnect();
  }, [end, duration, suffix, prefix]);

  return (
    <span ref={countRef} className="text-4xl md:text-6xl font-bold text-[#C6A86B]" data-testid="counter-animation">
      {prefix}0{suffix}
    </span>
  );
}
