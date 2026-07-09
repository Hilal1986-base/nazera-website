'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import Image from 'next/image';
import { useLocale, useTArray } from '@/i18n/LocaleContext';
import en from '@/i18n/locales/en.json';
import ar from '@/i18n/locales/ar.json';
import id from '@/i18n/locales/id.json';

const localeMap: Record<string, Record<string, unknown>> = { en, ar, id };

export function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const { t, locale, messages } = useLocale();

  // For nested arrays we need direct JSON access
  const msgs = localeMap[locale] as Record<string, any>;
  const footerLinksRaw = msgs?.footer?.links || {};
  const social = (msgs?.footer?.social || []) as string[];
  const footerStats = useTArray('footer.stats') as Array<Record<string, unknown>>;

  const footerCategoryKeys = ['Company', 'Services', 'Resources', 'Legal'] as const;
  const footerCategoryLabels: Record<string, string> = {
    Company: t('footer.footerCategoryCompany'),
    Services: t('footer.footerCategoryServices'),
    Resources: t('footer.footerCategoryResources'),
    Legal: t('footer.footerCategoryLegal'),
  };

  const groupedLinks = useMemo(() => {
    const groups: Record<string, string[]> = {};
    footerCategoryKeys.forEach((cat) => {
      const val = footerLinksRaw[cat];
      if (Array.isArray(val)) {
        groups[cat] = val.map(String);
      }
    });
    return groups;
  }, [locale, messages]);

  return (
    <footer className="bg-navy text-white" ref={ref}>
      {/* Stats bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-cyan mb-0.5">
                  {String(stat.value)}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  {String(stat.label)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="NAZERA"
              width={140}
              height={38}
              className="h-9 w-auto object-contain brightness-0 invert mb-4"
            />
            <p className="text-sm text-white/40 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {footerCategoryKeys.map((key) => {
            const links = groupedLinks[key] || [];
            const label = footerCategoryLabels[key] || key;
            return (
              <div key={key}>
                <h4 className="text-white/80 font-semibold text-xs mb-4 uppercase tracking-wider">
                  {label}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/35 hover:text-cyan transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            {social.map((s) => (
              <a key={s} href="#" className="text-[11px] text-white/25 hover:text-cyan transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}