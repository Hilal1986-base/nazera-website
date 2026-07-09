'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Building2,
  Cpu,
  Zap,
  Landmark,
  Users,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTArray, LOCALES } from '@/i18n/LocaleContext';

const iconMap: Record<string, any> = { Building2, Cpu, Zap, Landmark, Users };
const serviceIcons = [Building2, Cpu, Zap, Landmark, Users];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t, locale } = useLocale();
  const isRTL = LOCALES.find(l => l.code === locale)?.dir === 'rtl';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const rawServices = useTArray('services.items');

  return (
    <section id="services" className="py-28 lg:py-36 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t('services.subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-navy">
            {t('services.titleBefore') && <>{t('services.titleBefore')} </>}<span className="text-blue-gradient">{t('services.titleHighlight')}</span>
          </h2>
          <p className="text-foreground/45 text-[15px] leading-relaxed">
            {t('services.description')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rawServices.map((s, i) => {
            const service = s as Record<string, unknown>;
            const features = (Array.isArray(service.features) ? service.features : []) as string[];
            const IconComp = serviceIcons[i] || Building2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-[#F8F9FA] border border-[#DDE3EC] rounded-2xl p-7 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-blue-gradient flex items-center justify-center mb-5 shadow-sm shadow-navy/10">
                  <IconComp className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-[17px] font-semibold mb-2.5 text-navy group-hover:text-cyan transition-colors">
                  {String(service.title)}
                </h3>

                <p className="text-foreground/45 text-sm leading-relaxed mb-5">
                  {String(service.description)}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {features.map((f) => (
                    <span
                      key={String(f)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white text-chrome font-medium border border-[#DDE3EC]"
                    >
                      {String(f)}
                    </span>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="text-navy hover:text-cyan p-0 h-auto justify-start text-sm group/btn"
                >
                  {t('services.learnMore')}
                  <Arrow className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}