'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLocale, useTArray, LOCALES } from '@/i18n/LocaleContext';

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t, locale } = useLocale();
  const isRTL = LOCALES.find(l => l.code === locale)?.dir === 'rtl';
  const highlights = useTArray('about.highlights') as string[];

  return (
    <section id="about" className="py-28 lg:py-36 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#DDE3EC]">
              {/* Diagonal overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background:
                    'linear-gradient(135deg, #1A3A6B 0%, #4AC6EB 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 40%, rgba(26,58,107,0.03) 100%)',
                }}
              />
              {/* Center mark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl font-bold text-navy/[0.04] tracking-tight">
                    N
                  </div>
                  <div className="text-xs tracking-[0.35em] text-chrome/60 uppercase mt-1">
                    Est. {t('about.foundingYear')}
                  </div>
                </div>
              </div>
              {/* Diagonal silver accent */}
              <div
                className="absolute top-0 right-0 w-24 h-full"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 50%, rgba(224,229,236,0.4) 50%)',
                }}
              />
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`absolute -bottom-5 ${isRTL ? '-left-3 sm:-left-5' : '-right-3 sm:-right-5'} border-[#DDE3EC] rounded-xl p-4 shadow-sm`}
            >
              <div className="text-2xl font-bold text-blue-gradient">
                {t('about.floatingStat')}
              </div>
              <div className="text-xs text-chrome mt-0.5">
                {t('about.floatingLabel')}
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              {t('about.subtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 leading-[1.15] text-navy">
              {t('about.headline1')}{' '}
              <span className="text-blue-gradient">{t('about.accent1')}</span>{' '}
              {t('about.connector')}{' '}
              <span className="text-blue-gradient">{t('about.accent2')}</span>
            </h2>
            <p className="text-foreground/50 text-[15px] leading-relaxed mb-4">
              {t('about.paragraph1')}
            </p>
            <p className="text-foreground/50 text-[15px] leading-relaxed mb-8">
              {t('about.paragraph2')}
            </p>

            <div className="space-y-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 text-cyan shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/60">{String(item)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}