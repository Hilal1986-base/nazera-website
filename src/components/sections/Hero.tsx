'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useLocale, LOCALES } from '@/i18n/LocaleContext';

function DiagonalParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        isBlue: Math.random() > 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isBlue
              ? 'linear-gradient(135deg, #1A3A6B, #4AC6EB)'
              : 'linear-gradient(135deg, #7A869A, #E0E5EC)',
            opacity: 0.15,
          }}
          animate={{
            x: [0, 120, 240],
            y: [-120, -60, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { t, locale } = useLocale();
  const isRTL = LOCALES.find(l => l.code === locale)?.dir === 'rtl';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden"
      ref={ref}
    >
      {/* Subtle diagonal grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #1A3A6B 0px, #1A3A6B 1px, transparent 1px, transparent 80px)',
        }}
      />

      <DiagonalParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-10 flex justify-center"
        >
          <Image
            src="/logo.png"
            alt="NAZERA"
            width={240}
            height={65}
            className="h-16 sm:h-20 w-auto object-contain"
            priority
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight leading-[1.1] mb-6 text-navy"
        >
          {t('hero.headline')}{' '}
          <span className="text-blue-gradient">{t('hero.accent')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-foreground/50 leading-relaxed mb-10"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() =>
              document
                .querySelector('#services')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            size="lg"
            className="bg-blue-gradient text-white hover:opacity-90 font-medium px-8 py-6 rounded-full text-sm shadow-lg shadow-navy/10"
          >
            {t('hero.ctaPrimary')}
            <Arrow className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document
                .querySelector('#about')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="border-chrome/40 text-navy hover:bg-[#F8F9FA] hover:border-chrome px-8 py-6 rounded-full text-sm"
            style={{
              borderImage: 'linear-gradient(135deg, #E0E5EC, #7A869A) 1',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderImageSlice: 1,
            }}
          >
            {t('hero.ctaSecondary')}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-chrome/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1 rounded-full bg-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}