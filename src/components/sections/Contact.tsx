'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocale, useTArray, LOCALES } from '@/i18n/LocaleContext';

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { t, locale } = useLocale();
  const isRTL = LOCALES.find(l => l.code === locale)?.dir === 'rtl';
  const rawOffices = useTArray('contact.offices.items');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          message: data.get('message'),
        }),
      });
      if (res.ok) {
        toast({ title: t('contact.toast.sent'), description: t('contact.toast.sentDesc') });
        form.reset();
      } else throw new Error();
    } catch {
      toast({ title: t('contact.toast.error'), description: t('contact.toast.errorDesc'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 lg:py-36 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-cyan text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            {t('contact.subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-navy">
            {t('contact.titleBefore') && <>{t('contact.titleBefore')}&apos;s </>}<span className="text-blue-gradient">{t('contact.titleHighlight')}</span>
          </h2>
          <p className="text-foreground/45 text-[15px] leading-relaxed">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white border border-[#DDE3EC] rounded-2xl p-7 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-navy/70">{t('contact.form.fullName')} *</Label>
                  <Input id="name" name="name" required placeholder={t('contact.form.namePlaceholder')} className="bg-[#F8F9FA] border-[#DDE3EC] focus:border-cyan h-11 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-navy/70">{t('contact.form.email')} *</Label>
                  <Input id="email" name="email" type="email" required placeholder={t('contact.form.emailPlaceholder')} className="bg-[#F8F9FA] border-[#DDE3EC] focus:border-cyan h-11 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                <Label htmlFor="company" className="text-xs font-medium text-navy/70">{t('contact.form.company')}</Label>
                <Input id="company" name="company" placeholder={t('contact.form.companyPlaceholder')} className="bg-[#F8F9FA] border-[#DDE3EC] focus:border-cyan h-11 text-sm" />
              </div>
              <div className="space-y-1.5 mb-6">
                <Label htmlFor="message" className="text-xs font-medium text-navy/70">{t('contact.form.message')} *</Label>
                <Textarea id="message" name="message" required rows={4} placeholder={t('contact.form.messagePlaceholder')} className="bg-[#F8F9FA] border-[#DDE3EC] focus:border-cyan resize-none text-sm" />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-gradient text-white hover:opacity-90 font-medium h-11 rounded-full shadow-sm shadow-navy/10"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('contact.form.send')}
                    <Send className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="bg-white border border-[#DDE3EC] rounded-2xl p-6 space-y-4">
              {[
                { icon: Mail, label: t('contact.info.email'), value: t('contact.info.emailValue') },
                { icon: Phone, label: t('contact.info.phone'), value: t('contact.info.phoneValue') },
                { icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue') },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#F8F9FA] border border-[#DDE3EC] flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-navy">{item.label}</p>
                    <p className="text-[13px] text-chrome">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold text-chrome uppercase tracking-[0.15em]">
                {t('contact.offices.title')}
              </h3>
              {rawOffices.map((item, idx) => {
                const office = item as Record<string, unknown>;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#DDE3EC] rounded-xl p-4 hover:border-cyan/20 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-3.5 w-3.5 text-cyan mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy">{String(office.city)}</p>
                        <p className="text-[12px] text-chrome">{String(office.address)}</p>
                        <p className="text-[11px] text-cyan mt-0.5">{String(office.type)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}