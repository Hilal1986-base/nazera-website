'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLocale, useTArray } from '@/i18n/LocaleContext';

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLocale();
  const rawTestimonials = useTArray('testimonials.items');

  return (
    <section className="py-28 lg:py-36 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t('testimonials.subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-navy">
            {t('testimonials.titleBefore') && <>{t('testimonials.titleBefore')} </>}<span className="text-blue-gradient">{t('testimonials.titleHighlight')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {rawTestimonials.map((item, i) => {
            const tm = item as Record<string, unknown>;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#DDE3EC] rounded-2xl p-7 hover:shadow-lg hover:shadow-cyan/5 transition-all duration-300"
              >
                <Quote className="h-7 w-7 text-cyan/15 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-cyan text-cyan" />
                  ))}
                </div>
                <p className="text-foreground/50 text-sm leading-relaxed mb-6">
                  &ldquo;{String(tm.text)}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#DDE3EC]">
                  <div className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-[#DDE3EC] flex items-center justify-center">
                    <span className="text-navy text-xs font-bold">{String(tm.initials)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{String(tm.name)}</p>
                    <p className="text-[11px] text-chrome">{String(tm.role)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}