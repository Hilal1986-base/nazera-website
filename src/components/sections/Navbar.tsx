'use client';

import { useState, useEffect } from 'react';
import { Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useLocale, LOCALES } from '@/i18n/LocaleContext';

export function Navbar({ onAdminToggle }: { onAdminToggle?: () => void }) {
  const { t, locale, setLocale, dir } = useLocale();
  const isRTL = dir === 'rtl';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.team'), href: '#team' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLocale = () => {
    const idx = LOCALES.findIndex(l => l.code === locale);
    const next = LOCALES[(idx + 1) % LOCALES.length];
    setLocale(next.code);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_#DDE3EC]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center">
        {/* Logo — always at the inline-start (left in LTR, right in RTL) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleClick('#home');
          }}
          className="shrink-0"
        >
          <Image
            src="/logo.png"
            alt="NAZERA"
            width={150}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </a>

        {/* Spacer pushes everything after it to the inline-end */}
        <div className="flex-1" />

        {/* Desktop Nav + CTA */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="px-4 py-2 text-[13px] font-medium tracking-wide text-foreground/70 hover:text-navy transition-colors"
            >
              {link.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-[#DDE3EC] mx-2" />

          {/* Language Switcher */}
          <button
            onClick={switchLocale}
            className="px-3 py-2 text-[13px] font-medium tracking-wide text-foreground/70 hover:text-navy transition-colors flex items-center gap-1.5"
          >
            <Globe className="h-4 w-4" />
            <span>{LOCALES.find(l => l.code === locale)?.label}</span>
          </button>

          {/* CTA */}
          <Button
            onClick={() => handleClick('#contact')}
            className="bg-blue-gradient text-white hover:opacity-90 font-medium px-6 rounded-full text-sm ms-2"
          >
            {t('nav.contactUs')}
          </Button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2 ms-auto">
          {/* Language Switcher - Mobile inline */}
          <button
            onClick={switchLocale}
            className="px-2.5 py-2 text-[13px] font-medium text-foreground/70 hover:text-navy transition-colors flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRTL ? 'left' : 'right'}
              className="w-[280px] bg-white border-[#DDE3EC] p-0"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-[#DDE3EC]">
                  <Image
                    src="/logo.png"
                    alt="NAZERA"
                    width={110}
                    height={30}
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <div className="flex-1 py-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleClick(link.href)}
                      className="w-full text-start px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-navy hover:bg-[#F8F9FA] transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
                <div className="p-6 border-t border-[#DDE3EC] space-y-3">
                  <Button
                    onClick={() => handleClick('#contact')}
                    className="w-full bg-blue-gradient text-white font-medium rounded-full"
                  >
                    {t('nav.contactUs')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}