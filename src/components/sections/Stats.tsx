'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Building2, Users, Globe, Award } from 'lucide-react';
import { useLocale, useTArray } from '@/i18n/LocaleContext';

const iconMap: Record<string, any> = { Building2, Users, Globe, Award };
const iconNames = ['Building2', 'Users', 'Globe', 'Award'];

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return <>{count.toLocaleString()}</>;
}

export function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLocale();
  const rawStats = useTArray('stats.items');

  return (
    <section className="py-24 bg-[#F8F9FA] relative overflow-hidden" ref={ref}>
      {/* Diagonal accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-[60%] h-[200%] opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(45deg, #1A3A6B 0px, #1A3A6B 1px, transparent 1px, transparent 60px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {rawStats.map((s, i) => {
            const stat = s as Record<string, unknown>;
            const IconComp = iconMap[iconNames[i]] || Building2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-11 h-11 mx-auto mb-4 rounded-xl bg-white border border-[#DDE3EC] flex items-center justify-center">
                  <IconComp className="h-5 w-5 text-navy" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-navy mb-1.5">
                  <AnimatedNumber value={Number(stat.value) || 0} inView={inView} />
                  <span className="text-cyan">{String(stat.suffix)}</span>
                </div>
                <div className="text-sm font-medium text-navy/70 mb-0.5">
                  {String(stat.label)}
                </div>
                <p className="text-xs text-chrome">{String(stat.description)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}