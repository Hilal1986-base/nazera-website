'use client';

import { useState, useCallback } from 'react';
import { LoadingAnimation } from '@/components/sections/LoadingAnimation';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { DiagonalDivider } from '@/components/sections/DiagonalDivider';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Stats } from '@/components/sections/Stats';
import { Portfolio } from '@/components/sections/Portfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Team } from '@/components/sections/Team';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LocaleProvider, useLocale } from '@/i18n/LocaleContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

function SiteContent() {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingAnimation onComplete={handleComplete} />}
      <div className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <DiagonalDivider color="#F8F9FA" />
            <About />
            <DiagonalDivider color="#FFFFFF" flip />
            <Services />
            <DiagonalDivider color="#F8F9FA" />
            <Stats />
            <DiagonalDivider color="#FFFFFF" flip />
            <Portfolio />
            <DiagonalDivider color="#F8F9FA" />
            <Testimonials />
            <DiagonalDivider color="#FFFFFF" flip />
            <Team />
            <DiagonalDivider color="#F8F9FA" />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

function AdminButton({ onAdminSuccess }: { onAdminSuccess: () => void }) {
  const { t, dir } = useLocale();
  const isRTL = dir === 'rtl';
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const handleAdminClick = () => {
    setAdminPassword('');
    setAdminError('');
    setAdminDialogOpen(true);
  };

  const handleAdminLogin = async () => {
    setAuthenticating(true);
    setAdminError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminDialogOpen(false);
        onAdminSuccess();
      } else {
        setAdminError(t('admin.incorrectPassword'));
      }
    } catch {
      setAdminError(t('admin.authFailed'));
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <>
      {/* Admin Access Button - subtle, bottom-right */}
      <button
        onClick={handleAdminClick}
        className={`fixed bottom-6 z-50 w-10 h-10 rounded-full bg-navy/5 hover:bg-navy/10 border border-[#DDE3EC] flex items-center justify-center transition-all duration-200 opacity-30 hover:opacity-70 ${isRTL ? 'left-6' : 'right-6'}`}
        aria-label={t('admin.access')}
        title={t('admin.access')}
      >
        <ShieldCheck className="h-4 w-4 text-chrome" />
      </button>

      {/* Admin Password Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-navy">{t('admin.access')}</DialogTitle>
            <DialogDescription className="text-chrome">
              {t('admin.password')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-xs font-medium text-navy/70">
                {t('admin.password')}
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder={t('admin.passwordPlaceholder')}
                className="bg-[#F8F9FA] border-[#DDE3EC] focus:border-cyan h-11 text-sm"
                autoFocus
              />
              {adminError && (
                <p className="text-xs text-red-500">{adminError}</p>
              )}
            </div>
            <Button
              onClick={handleAdminLogin}
              disabled={authenticating || !adminPassword}
              className="w-full bg-blue-gradient text-white hover:opacity-90 font-medium h-11 rounded-full"
            >
              {authenticating ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('admin.verifying')}
                </span>
              ) : (
                t('admin.accessDashboard')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Home() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleBackToSite = () => {
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return <AdminDashboard onBack={handleBackToSite} />;
  }

  return (
    <LocaleProvider>
      <SiteContent />
      <AdminButton onAdminSuccess={() => setIsAdminMode(true)} />
    </LocaleProvider>
  );
}