'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocale, useTArray, LOCALES } from '@/i18n/LocaleContext';

export function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t, locale } = useLocale();
  const isRTL = LOCALES.find(l => l.code === locale)?.dir === 'rtl';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [active, setActive] = useState('all');
  const rawProjects = useTArray('portfolio.items');

  const projects = useMemo(() => {
    return rawProjects.map((p) => p as Record<string, unknown>);
  }, [rawProjects]);

  const categories = useMemo(
    () => ['all', ...new Set(projects.map((p) => String(p.category)))],
    [projects]
  );

  const filtered = active === 'all' ? projects : projects.filter((p) => String(p.category) === active);

  return (
    <section id="portfolio" className="py-28 lg:py-36 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t('portfolio.subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-navy">
            {t('portfolio.titleBefore') && <>{t('portfolio.titleBefore')} </>}<span className="text-blue-gradient">{t('portfolio.titleHighlight')}</span>
          </h2>
          <p className="text-foreground/45 text-[15px] leading-relaxed">
            {t('portfolio.description')}
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-blue-gradient text-white shadow-sm shadow-navy/10'
                  : 'bg-[#F8F9FA] text-chrome hover:text-navy border border-[#DDE3EC]'
              }`}
            >
              {cat === 'all' ? t('portfolio.all') : cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={String(project.title)}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group bg-white border border-[#DDE3EC] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-cyan/5 hover:border-cyan/20 transition-all duration-300"
            >
              {/* Image area */}
              <div className="relative aspect-[16/10] bg-[#F8F9FA] overflow-hidden">
                {/* Diagonal overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.02] to-cyan/[0.03]" />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(26,58,107,0.03) 100%)',
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-navy/[0.05]">
                    {String(project.title).charAt(0)}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center">
                      <ExternalLink className="h-4 w-4 text-navy" />
                    </div>
                  </div>
                </div>
                <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                  <Badge className="bg-white/90 text-navy font-semibold text-[11px] border border-[#DDE3EC] backdrop-blur-sm">
                    {String(project.stats)}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-medium text-cyan bg-cyan/5 px-2 py-0.5 rounded-full">
                    {String(project.category)}
                  </span>
                  <span className="text-[11px] text-chrome">{String(project.location)}</span>
                </div>
                <h3 className="text-base font-semibold mb-1.5 text-navy group-hover:text-cyan transition-colors">
                  {String(project.title)}
                </h3>
                <p className="text-sm text-foreground/40 leading-relaxed line-clamp-2 mb-3">
                  {String(project.description)}
                </p>
                <Button variant="ghost" className="text-navy hover:text-cyan p-0 h-auto text-sm group/btn">
                  {t('portfolio.viewDetails')}
                  <Arrow className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}