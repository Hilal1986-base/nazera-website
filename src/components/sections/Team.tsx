'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTArray } from '@/i18n/LocaleContext';

export function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLocale();
  const rawTeam = useTArray('team.items');

  return (
    <section id="team" className="py-28 lg:py-36 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t('team.subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-navy">
            {t('team.titleBefore') && <>{t('team.titleBefore')} </>}<span className="text-blue-gradient">{t('team.titleHighlight')}</span>
          </h2>
          <p className="text-foreground/45 text-[15px] leading-relaxed">
            {t('team.description')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rawTeam.map((item, i) => {
            const m = item as Record<string, unknown>;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group text-center"
              >
                <div className="bg-[#F8F9FA] border border-[#DDE3EC] rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan/5 hover:border-cyan/20 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white border-2 border-[#DDE3EC] group-hover:border-cyan/30 flex items-center justify-center transition-colors">
                    <span className="text-lg font-bold text-navy">{String(m.initials)}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-navy mb-0.5">{String(m.name)}</h3>
                  <p className="text-xs font-medium text-cyan mb-3">{String(m.role)}</p>
                  <p className="text-foreground/40 text-[13px] leading-relaxed mb-4">
                    {String(m.bio)}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-chrome hover:text-cyan">
                      <Linkedin className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-chrome hover:text-cyan">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
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