'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderOpen,
  MessageSquareQuote,
  Users,
  BarChart3,
  Mail,
  Settings,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Menu,
  X,
  Building2,
  Cpu,
  Zap,
  Landmark,
  Globe,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string;
  order: number;
  active: boolean;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  stats: string;
  order: number;
  active: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  initials: string;
  active: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin: string;
  email: string;
  active: boolean;
}

interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  iconName: string;
  active: boolean;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Office {
  id: string;
  city: string;
  address: string;
  type: string;
  order: number;
  active: boolean;
}

interface FooterLink {
  id: string;
  category: string;
  label: string;
  href: string;
  order: number;
}

type PanelId =
  | 'dashboard'
  | 'hero-about'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'team'
  | 'stats'
  | 'contact'
  | 'settings';

// ─── Helper ───────────────────────────────────────────────────────
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ─── Navigation Config ────────────────────────────────────────────
const navItems: { id: PanelId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero-about', label: 'Hero & About', icon: FileText },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Component ────────────────────────────────────────────────────
export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── Data States ──────────────────────────────────────────────
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [contactSubs, setContactSubs] = useState<ContactSubmission[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [offices, setOffices] = useState<Office[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  // ─── Loading States ───────────────────────────────────────────
  const [loadingDash, setLoadingDash] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [loadingFooterLinks, setLoadingFooterLinks] = useState(false);
  const [loadingHeroAbout, setLoadingHeroAbout] = useState(false);

  // ─── Dialog States ────────────────────────────────────────────
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon: '', features: '', order: 0, active: true,
  });

  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioProject | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', category: 'Real Estate', location: '', description: '', stats: '', order: 0, active: true,
  });

  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', text: '', initials: '', active: true,
  });

  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '', role: '', bio: '', initials: '', linkedin: '', email: '', active: true,
  });

  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [statForm, setStatForm] = useState({
    value: 0, suffix: '+', label: '', description: '', iconName: '', active: true,
  });

  const [officeDialogOpen, setOfficeDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [officeForm, setOfficeForm] = useState({
    city: '', address: '', type: '', order: 0, active: true,
  });

  const [footerLinkDialogOpen, setFooterLinkDialogOpen] = useState(false);
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLink | null>(null);
  const [footerLinkForm, setFooterLinkForm] = useState({
    category: '', label: '', href: '#', order: 0,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; api: string } | null>(null);

  // ─── Hero & About Form ────────────────────────────────────────
  const [heroForm, setHeroForm] = useState({
    hero_headline: '',
    hero_headline_accent: '',
    hero_subtitle: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
  });
  const [aboutForm, setAboutForm] = useState({
    about_subtitle: '',
    about_headline_part1: '',
    about_headline_accent1: '',
    about_headline_connector: '',
    about_headline_accent2: '',
    about_paragraph1: '',
    about_paragraph2: '',
    about_founding_year: '',
    about_floating_stat: '',
    about_floating_label: '',
  });

  // ─── Settings Forms ───────────────────────────────────────────
  const [contactInfoForm, setContactInfoForm] = useState({
    contact_email: '',
    contact_phone: '',
    contact_hours: '',
  });
  const [socialLinksForm, setSocialLinksForm] = useState('');

  // ─── Fetch Functions ──────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setLoadingDash(true);
    try {
      const [s, p, t, tm, st, c] = await Promise.all([
        fetcher('/api/admin/services'),
        fetcher('/api/admin/portfolio'),
        fetcher('/api/admin/testimonials'),
        fetcher('/api/admin/team'),
        fetcher('/api/admin/stats'),
        fetcher('/api/admin/contact'),
      ]);
      setServices(s);
      setPortfolio(p);
      setTestimonials(t);
      setTeam(tm);
      setStats(st);
      setContactSubs(c);
    } catch {
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setLoadingDash(false);
    }
  }, [toast]);

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    const data = await fetcher('/api/admin/services').catch(() => []);
    setServices(data);
    setLoadingServices(false);
  }, []);

  const fetchPortfolio = useCallback(async () => {
    setLoadingPortfolio(true);
    const data = await fetcher('/api/admin/portfolio').catch(() => []);
    setPortfolio(data);
    setLoadingPortfolio(false);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    const data = await fetcher('/api/admin/testimonials').catch(() => []);
    setTestimonials(data);
    setLoadingTestimonials(false);
  }, []);

  const fetchTeam = useCallback(async () => {
    setLoadingTeam(true);
    const data = await fetcher('/api/admin/team').catch(() => []);
    setTeam(data);
    setLoadingTeam(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    const data = await fetcher('/api/admin/stats').catch(() => []);
    setStats(data);
    setLoadingStats(false);
  }, []);

  const fetchContact = useCallback(async () => {
    setLoadingContact(true);
    const data = await fetcher('/api/admin/contact').catch(() => []);
    setContactSubs(data);
    setLoadingContact(false);
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    const data = await fetcher('/api/admin/settings').catch(() => ({}));
    setSettings(data);
    setContactInfoForm({
      contact_email: data.contact_email || '',
      contact_phone: data.contact_phone || '',
      contact_hours: data.contact_hours || '',
    });
    try {
      const links = data.social_links ? JSON.parse(data.social_links) : [];
      setSocialLinksForm(Array.isArray(links) ? links.join(', ') : '');
    } catch {
      setSocialLinksForm('');
    }
    setLoadingSettings(false);
  }, []);

  const fetchOffices = useCallback(async () => {
    setLoadingOffices(true);
    const data = await fetcher('/api/admin/offices').catch(() => []);
    setOffices(data);
    setLoadingOffices(false);
  }, []);

  const fetchFooterLinks = useCallback(async () => {
    setLoadingFooterLinks(true);
    const data = await fetcher('/api/admin/footer-links').catch(() => []);
    setFooterLinks(data);
    setLoadingFooterLinks(false);
  }, []);

  const fetchHeroAbout = useCallback(async () => {
    setLoadingHeroAbout(true);
    const data = await fetcher('/api/admin/settings').catch(() => ({}));
    setHeroForm({
      hero_headline: data.hero_headline || '',
      hero_headline_accent: data.hero_headline_accent || '',
      hero_subtitle: data.hero_subtitle || '',
      hero_cta_primary: data.hero_cta_primary || '',
      hero_cta_secondary: data.hero_cta_secondary || '',
    });
    setAboutForm({
      about_subtitle: data.about_subtitle || '',
      about_headline_part1: data.about_headline_part1 || '',
      about_headline_accent1: data.about_headline_accent1 || '',
      about_headline_connector: data.about_headline_connector || '',
      about_headline_accent2: data.about_headline_accent2 || '',
      about_paragraph1: data.about_paragraph1 || '',
      about_paragraph2: data.about_paragraph2 || '',
      about_founding_year: data.about_founding_year || '',
      about_floating_stat: data.about_floating_stat || '',
      about_floating_label: data.about_floating_label || '',
    });
    setLoadingHeroAbout(false);
  }, []);

  // ─── Effects ──────────────────────────────────────────────────
  useEffect(() => {
    if (activePanel === 'dashboard') fetchDashboard();
    else if (activePanel === 'services') fetchServices();
    else if (activePanel === 'portfolio') fetchPortfolio();
    else if (activePanel === 'testimonials') fetchTestimonials();
    else if (activePanel === 'team') fetchTeam();
    else if (activePanel === 'stats') fetchStats();
    else if (activePanel === 'contact') fetchContact();
    else if (activePanel === 'settings') {
      fetchSettings();
      fetchOffices();
      fetchFooterLinks();
    } else if (activePanel === 'hero-about') fetchHeroAbout();
  }, [activePanel]);

  // ─── Mutation Helpers ─────────────────────────────────────────
  const mutate = async (method: string, url: string, body?: unknown) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  // ─── Panel Title Map ──────────────────────────────────────────
  const panelTitle: Record<PanelId, string> = {
    dashboard: 'Dashboard',
    'hero-about': 'Hero & About',
    services: 'Services',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    team: 'Team',
    stats: 'Stats',
    contact: 'Contact Submissions',
    settings: 'Settings',
  };

  // ─── Handle Navigation ────────────────────────────────────────
  const handleNav = (id: PanelId) => {
    setActivePanel(id);
    setSidebarOpen(false);
  };

  // ─── Shared Badges ────────────────────────────────────────────
  const ActiveBadge = ({ active }: { active: boolean }) => (
    <Badge className={active ? 'bg-green-50 text-green-700 hover:bg-green-50' : 'bg-red-50 text-red-600 hover:bg-red-50'}>
      {active ? 'Active' : 'Inactive'}
    </Badge>
  );

  const ReadBadge = ({ read }: { read: boolean }) => (
    <Badge className={read ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' : 'bg-amber-50 text-amber-700 hover:bg-amber-50'}>
      {read ? 'Read' : 'Unread'}
    </Badge>
  );

  // ─── Delete Confirmation ──────────────────────────────────────
  const confirmDelete = (id: string, label: string, api: string) => {
    setDeleteTarget({ id, label, api });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await mutate('DELETE', `/api/admin/${deleteTarget.api}/${deleteTarget.id}`);
    toast({ title: 'Deleted', description: `${deleteTarget.label} has been deleted.` });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    if (activePanel === 'services') fetchServices();
    else if (activePanel === 'portfolio') fetchPortfolio();
    else if (activePanel === 'testimonials') fetchTestimonials();
    else if (activePanel === 'team') fetchTeam();
    else if (activePanel === 'stats') fetchStats();
    else if (activePanel === 'contact') fetchContact();
    else if (activePanel === 'settings') {
      fetchOffices();
      fetchFooterLinks();
    }
  };

  // ─── Services CRUD ────────────────────────────────────────────
  const openServiceDialog = (item?: Service) => {
    if (item) {
      setEditingService(item);
      let featuresStr = '';
      try { featuresStr = JSON.parse(item.features).join(', '); } catch { featuresStr = item.features; }
      setServiceForm({
        title: item.title, description: item.description, icon: item.icon,
        features: featuresStr, order: item.order, active: item.active,
      });
    } else {
      setEditingService(null);
      setServiceForm({ title: '', description: '', icon: '', features: '', order: 0, active: true });
    }
    setServiceDialogOpen(true);
  };

  const saveService = async () => {
    const payload = {
      ...serviceForm,
      features: JSON.stringify(serviceForm.features.split(',').map((f) => f.trim()).filter(Boolean)),
    };
    if (editingService) {
      await mutate('PUT', `/api/admin/services/${editingService.id}`, payload);
      toast({ title: 'Updated', description: 'Service updated successfully.' });
    } else {
      await mutate('POST', '/api/admin/services', payload);
      toast({ title: 'Created', description: 'Service created successfully.' });
    }
    setServiceDialogOpen(false);
    fetchServices();
  };

  // ─── Portfolio CRUD ───────────────────────────────────────────
  const openPortfolioDialog = (item?: PortfolioProject) => {
    if (item) {
      setEditingPortfolio(item);
      setPortfolioForm({
        title: item.title, category: item.category, location: item.location,
        description: item.description, stats: item.stats, order: item.order, active: item.active,
      });
    } else {
      setEditingPortfolio(null);
      setPortfolioForm({ title: '', category: 'Real Estate', location: '', description: '', stats: '', order: 0, active: true });
    }
    setPortfolioDialogOpen(true);
  };

  const savePortfolio = async () => {
    if (editingPortfolio) {
      await mutate('PUT', `/api/admin/portfolio/${editingPortfolio.id}`, portfolioForm);
      toast({ title: 'Updated', description: 'Portfolio project updated.' });
    } else {
      await mutate('POST', '/api/admin/portfolio', portfolioForm);
      toast({ title: 'Created', description: 'Portfolio project created.' });
    }
    setPortfolioDialogOpen(false);
    fetchPortfolio();
  };

  // ─── Testimonials CRUD ────────────────────────────────────────
  const openTestimonialDialog = (item?: Testimonial) => {
    if (item) {
      setEditingTestimonial(item);
      setTestimonialForm({
        name: item.name, role: item.role, text: item.text,
        initials: item.initials, active: item.active,
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({ name: '', role: '', text: '', initials: '', active: true });
    }
    setTestimonialDialogOpen(true);
  };

  const saveTestimonial = async () => {
    if (editingTestimonial) {
      await mutate('PUT', `/api/admin/testimonials/${editingTestimonial.id}`, testimonialForm);
      toast({ title: 'Updated', description: 'Testimonial updated.' });
    } else {
      await mutate('POST', '/api/admin/testimonials', testimonialForm);
      toast({ title: 'Created', description: 'Testimonial created.' });
    }
    setTestimonialDialogOpen(false);
    fetchTestimonials();
  };

  // ─── Team CRUD ────────────────────────────────────────────────
  const openTeamDialog = (item?: TeamMember) => {
    if (item) {
      setEditingTeam(item);
      setTeamForm({
        name: item.name, role: item.role, bio: item.bio,
        initials: item.initials, linkedin: item.linkedin,
        email: item.email, active: item.active,
      });
    } else {
      setEditingTeam(null);
      setTeamForm({ name: '', role: '', bio: '', initials: '', linkedin: '', email: '', active: true });
    }
    setTeamDialogOpen(true);
  };

  const saveTeam = async () => {
    if (editingTeam) {
      await mutate('PUT', `/api/admin/team/${editingTeam.id}`, teamForm);
      toast({ title: 'Updated', description: 'Team member updated.' });
    } else {
      await mutate('POST', '/api/admin/team', teamForm);
      toast({ title: 'Created', description: 'Team member created.' });
    }
    setTeamDialogOpen(false);
    fetchTeam();
  };

  // ─── Stats CRUD ───────────────────────────────────────────────
  const openStatDialog = (item?: Stat) => {
    if (item) {
      setEditingStat(item);
      setStatForm({
        value: item.value, suffix: item.suffix, label: item.label,
        description: item.description, iconName: item.iconName, active: item.active,
      });
    } else {
      setEditingStat(null);
      setStatForm({ value: 0, suffix: '+', label: '', description: '', iconName: '', active: true });
    }
    setStatDialogOpen(true);
  };

  const saveStat = async () => {
    if (editingStat) {
      await mutate('PUT', `/api/admin/stats/${editingStat.id}`, statForm);
      toast({ title: 'Updated', description: 'Stat updated.' });
    } else {
      await mutate('POST', '/api/admin/stats', statForm);
      toast({ title: 'Created', description: 'Stat created.' });
    }
    setStatDialogOpen(false);
    fetchStats();
  };

  // ─── Contact Toggle Read ──────────────────────────────────────
  const toggleRead = async (item: ContactSubmission) => {
    await mutate('PUT', `/api/admin/contact/${item.id}`, { read: !item.read });
    toast({ title: item.read ? 'Marked Unread' : 'Marked Read', description: `${item.name} updated.` });
    fetchContact();
  };

  // ─── Hero & About Save ────────────────────────────────────────
  const saveHeroAbout = async () => {
    await mutate('PUT', '/api/admin/settings', { ...heroForm, ...aboutForm });
    toast({ title: 'Saved', description: 'Hero & About sections updated.' });
  };

  // ─── Settings Save ────────────────────────────────────────────
  const saveContactInfo = async () => {
    await mutate('PUT', '/api/admin/settings', contactInfoForm);
    toast({ title: 'Saved', description: 'Contact info updated.' });
  };

  const saveSocialLinks = async () => {
    const links = socialLinksForm.split(',').map((s) => s.trim()).filter(Boolean);
    await mutate('PUT', '/api/admin/settings', { social_links: JSON.stringify(links) });
    toast({ title: 'Saved', description: 'Social links updated.' });
  };

  // ─── Offices CRUD ─────────────────────────────────────────────
  const openOfficeDialog = (item?: Office) => {
    if (item) {
      setEditingOffice(item);
      setOfficeForm({
        city: item.city, address: item.address, type: item.type,
        order: item.order, active: item.active,
      });
    } else {
      setEditingOffice(null);
      setOfficeForm({ city: '', address: '', type: '', order: 0, active: true });
    }
    setOfficeDialogOpen(true);
  };

  const saveOffice = async () => {
    if (editingOffice) {
      await mutate('PUT', `/api/admin/offices/${editingOffice.id}`, officeForm);
      toast({ title: 'Updated', description: 'Office updated.' });
    } else {
      await mutate('POST', '/api/admin/offices', officeForm);
      toast({ title: 'Created', description: 'Office created.' });
    }
    setOfficeDialogOpen(false);
    fetchOffices();
  };

  // ─── Footer Links CRUD ────────────────────────────────────────
  const openFooterLinkDialog = (item?: FooterLink) => {
    if (item) {
      setEditingFooterLink(item);
      setFooterLinkForm({
        category: item.category, label: item.label, href: item.href, order: item.order,
      });
    } else {
      setEditingFooterLink(null);
      setFooterLinkForm({ category: '', label: '', href: '#', order: 0 });
    }
    setFooterLinkDialogOpen(true);
  };

  const saveFooterLink = async () => {
    if (editingFooterLink) {
      await mutate('PUT', `/api/admin/footer-links/${editingFooterLink.id}`, footerLinkForm);
      toast({ title: 'Updated', description: 'Footer link updated.' });
    } else {
      await mutate('POST', '/api/admin/footer-links', footerLinkForm);
      toast({ title: 'Created', description: 'Footer link created.' });
    }
    setFooterLinkDialogOpen(false);
    fetchFooterLinks();
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Dashboard Panel
  // ═══════════════════════════════════════════════════════════════
  const renderDashboard = () => {
    if (loadingDash) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-[#DDE3EC] rounded-xl p-5">
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6 col-span-full">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        </div>
      );
    }

    const statCards = [
      { label: 'Total Services', count: services.length, icon: Briefcase },
      { label: 'Portfolio Projects', count: portfolio.length, icon: FolderOpen },
      { label: 'Team Members', count: team.length, icon: Users },
      { label: 'Contact Messages', count: contactSubs.length, icon: Mail },
    ];

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="bg-white border border-[#DDE3EC] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-chrome uppercase tracking-wider">{s.label}</span>
                  <div className="w-9 h-9 rounded-lg bg-[#F8F9FA] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-navy" />
                  </div>
                </div>
                <span className="text-3xl font-bold text-navy">{s.count}</span>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold text-navy">Recent Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {contactSubs.length === 0 ? (
              <p className="text-sm text-chrome py-8 text-center">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#DDE3EC]">
                      <TableHead className="text-chrome text-xs uppercase">Name</TableHead>
                      <TableHead className="text-chrome text-xs uppercase">Email</TableHead>
                      <TableHead className="text-chrome text-xs uppercase">Date</TableHead>
                      <TableHead className="text-chrome text-xs uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubs.slice(0, 5).map((c) => (
                      <TableRow key={c.id} className="border-b border-[#DDE3EC]/50">
                        <TableCell className="text-sm">{c.name}</TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm text-chrome">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell><ReadBadge read={c.read} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Hero & About Panel
  // ═══════════════════════════════════════════════════════════════
  const renderHeroAbout = () => {
    if (loadingHeroAbout) {
      return (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white border border-[#DDE3EC] rounded-xl p-6">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold text-navy">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Headline (before accent)</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={heroForm.hero_headline}
                  onChange={(e) => setHeroForm({ ...heroForm, hero_headline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Headline Accent Word</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={heroForm.hero_headline_accent}
                  onChange={(e) => setHeroForm({ ...heroForm, hero_headline_accent: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-chrome">Subtitle</Label>
              <Textarea
                className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]"
                value={heroForm.hero_subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, hero_subtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Primary CTA Text</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={heroForm.hero_cta_primary}
                  onChange={(e) => setHeroForm({ ...heroForm, hero_cta_primary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Secondary CTA Text</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={heroForm.hero_cta_secondary}
                  onChange={(e) => setHeroForm({ ...heroForm, hero_cta_secondary: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={saveHeroAbout} className="bg-blue-gradient text-white hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold text-navy">About Section</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-chrome">Subtitle Label</Label>
              <Input
                className="bg-[#F8F9FA] border-[#DDE3EC]"
                value={aboutForm.about_subtitle}
                onChange={(e) => setAboutForm({ ...aboutForm, about_subtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Headline Part 1</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_headline_part1}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_headline_part1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Accent Word 1</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_headline_accent1}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_headline_accent1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Connector</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_headline_connector}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_headline_connector: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-chrome">Accent Word 2</Label>
              <Input
                className="bg-[#F8F9FA] border-[#DDE3EC] max-w-xs"
                value={aboutForm.about_headline_accent2}
                onChange={(e) => setAboutForm({ ...aboutForm, about_headline_accent2: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-chrome">Paragraph 1</Label>
              <Textarea
                className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]"
                value={aboutForm.about_paragraph1}
                onChange={(e) => setAboutForm({ ...aboutForm, about_paragraph1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-chrome">Paragraph 2</Label>
              <Textarea
                className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]"
                value={aboutForm.about_paragraph2}
                onChange={(e) => setAboutForm({ ...aboutForm, about_paragraph2: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Founding Year</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_founding_year}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_founding_year: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Floating Stat Value</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_floating_stat}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_floating_stat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-chrome">Floating Stat Label</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  value={aboutForm.about_floating_label}
                  onChange={(e) => setAboutForm({ ...aboutForm, about_floating_label: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={saveHeroAbout} className="bg-blue-gradient text-white hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Services Panel
  // ═══════════════════════════════════════════════════════════════
  const renderServices = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Services</h2>
        <Button onClick={() => openServiceDialog()} className="bg-blue-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>
      {loadingServices ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#DDE3EC]">
                  <TableHead className="text-chrome text-xs uppercase">Title</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Icon</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Features</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Order</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                  <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => {
                  let features: string[] = [];
                  try { features = JSON.parse(s.features); } catch { features = [s.features]; }
                  return (
                    <TableRow key={s.id} className="border-b border-[#DDE3EC]/50">
                      <TableCell className="text-sm font-medium">{s.title}</TableCell>
                      <TableCell className="text-sm text-chrome">{s.icon}</TableCell>
                      <TableCell className="text-sm text-chrome hidden md:table-cell">{features.join(', ')}</TableCell>
                      <TableCell className="text-sm">{s.order}</TableCell>
                      <TableCell><ActiveBadge active={s.active} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openServiceDialog(s)}>
                            <Pencil className="w-4 h-4 text-chrome" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(s.id, s.title, 'services')}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm">Title</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Description</Label>
              <Textarea className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Icon (Lucide icon name)</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" placeholder="e.g. Building2" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Features (comma-separated)</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" placeholder="Feature 1, Feature 2, Feature 3" value={serviceForm.features} onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Order</Label>
                <Input type="number" className="bg-[#F8F9FA] border-[#DDE3EC]" value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2 flex items-end pb-1">
                <div className="flex items-center gap-2">
                  <Switch checked={serviceForm.active} onCheckedChange={(v) => setServiceForm({ ...serviceForm, active: v })} />
                  <Label className="text-sm">Active</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setServiceDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveService} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Portfolio Panel
  // ═══════════════════════════════════════════════════════════════
  const renderPortfolio = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Portfolio Projects</h2>
        <Button onClick={() => openPortfolioDialog()} className="bg-blue-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>
      {loadingPortfolio ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#DDE3EC]">
                  <TableHead className="text-chrome text-xs uppercase">Title</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Category</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden lg:table-cell">Stats</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Order</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                  <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.map((p) => (
                  <TableRow key={p.id} className="border-b border-[#DDE3EC]/50">
                    <TableCell className="text-sm font-medium">{p.title}</TableCell>
                    <TableCell className="text-sm text-chrome">{p.category}</TableCell>
                    <TableCell className="text-sm text-chrome hidden md:table-cell">{p.location}</TableCell>
                    <TableCell className="text-sm text-chrome hidden lg:table-cell">{p.stats}</TableCell>
                    <TableCell className="text-sm">{p.order}</TableCell>
                    <TableCell><ActiveBadge active={p.active} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPortfolioDialog(p)}>
                          <Pencil className="w-4 h-4 text-chrome" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(p.id, p.title, 'portfolio')}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingPortfolio ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm">Title</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={portfolioForm.title} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Category</Label>
              <Select value={portfolioForm.category} onValueChange={(v) => setPortfolioForm({ ...portfolioForm, category: v })}>
                <SelectTrigger className="bg-[#F8F9FA] border-[#DDE3EC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Location</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={portfolioForm.location} onChange={(e) => setPortfolioForm({ ...portfolioForm, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Description</Label>
              <Textarea className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]" value={portfolioForm.description} onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Stats</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={portfolioForm.stats} onChange={(e) => setPortfolioForm({ ...portfolioForm, stats: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Order</Label>
                <Input type="number" className="bg-[#F8F9FA] border-[#DDE3EC]" value={portfolioForm.order} onChange={(e) => setPortfolioForm({ ...portfolioForm, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch checked={portfolioForm.active} onCheckedChange={(v) => setPortfolioForm({ ...portfolioForm, active: v })} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setPortfolioDialogOpen(false)}>Cancel</Button>
            <Button onClick={savePortfolio} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Testimonials Panel
  // ═══════════════════════════════════════════════════════════════
  const renderTestimonials = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Testimonials</h2>
        <Button onClick={() => openTestimonialDialog()} className="bg-blue-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>
      {loadingTestimonials ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#DDE3EC]">
                  <TableHead className="text-chrome text-xs uppercase">Name</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Role</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Text</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Initials</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                  <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id} className="border-b border-[#DDE3EC]/50">
                    <TableCell className="text-sm font-medium">{t.name}</TableCell>
                    <TableCell className="text-sm text-chrome">{t.role}</TableCell>
                    <TableCell className="text-sm text-chrome hidden md:table-cell max-w-[300px] truncate">{t.text}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">{t.initials}</div>
                    </TableCell>
                    <TableCell><ActiveBadge active={t.active} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTestimonialDialog(t)}>
                          <Pencil className="w-4 h-4 text-chrome" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(t.id, t.name, 'testimonials')}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Name</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Initials</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={testimonialForm.initials} onChange={(e) => setTestimonialForm({ ...testimonialForm, initials: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Role</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Text</Label>
              <Textarea className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[100px]" value={testimonialForm.text} onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch checked={testimonialForm.active} onCheckedChange={(v) => setTestimonialForm({ ...testimonialForm, active: v })} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTestimonial} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Team Panel
  // ═══════════════════════════════════════════════════════════════
  const renderTeam = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Team Members</h2>
        <Button onClick={() => openTeamDialog()} className="bg-blue-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>
      {loadingTeam ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#DDE3EC]">
                  <TableHead className="text-chrome text-xs uppercase">Name</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Role</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Initials</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">LinkedIn</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                  <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((t) => (
                  <TableRow key={t.id} className="border-b border-[#DDE3EC]/50">
                    <TableCell className="text-sm font-medium">{t.name}</TableCell>
                    <TableCell className="text-sm text-chrome">{t.role}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">{t.initials}</div>
                    </TableCell>
                    <TableCell className="text-sm text-chrome hidden md:table-cell">{t.linkedin || '—'}</TableCell>
                    <TableCell><ActiveBadge active={t.active} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTeamDialog(t)}>
                          <Pencil className="w-4 h-4 text-chrome" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(t.id, t.name, 'team')}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingTeam ? 'Edit Member' : 'Add Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Name</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Initials</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={teamForm.initials} onChange={(e) => setTeamForm({ ...teamForm, initials: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Role</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Bio</Label>
              <Textarea className="bg-[#F8F9FA] border-[#DDE3EC] min-h-[80px]" value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">LinkedIn URL</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch checked={teamForm.active} onCheckedChange={(v) => setTeamForm({ ...teamForm, active: v })} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setTeamDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTeam} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Stats Panel
  // ═══════════════════════════════════════════════════════════════
  const renderStats = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Stats</h2>
        <Button onClick={() => openStatDialog()} className="bg-blue-gradient text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Stat
        </Button>
      </div>
      {loadingStats ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#DDE3EC]">
                  <TableHead className="text-chrome text-xs uppercase">Value</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Suffix</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Label</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-chrome text-xs uppercase hidden lg:table-cell">Icon</TableHead>
                  <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                  <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s) => (
                  <TableRow key={s.id} className="border-b border-[#DDE3EC]/50">
                    <TableCell className="text-sm font-medium">{s.value}{s.suffix}</TableCell>
                    <TableCell className="text-sm text-chrome">{s.suffix}</TableCell>
                    <TableCell className="text-sm">{s.label}</TableCell>
                    <TableCell className="text-sm text-chrome hidden md:table-cell">{s.description}</TableCell>
                    <TableCell className="text-sm text-chrome hidden lg:table-cell">{s.iconName}</TableCell>
                    <TableCell><ActiveBadge active={s.active} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openStatDialog(s)}>
                          <Pencil className="w-4 h-4 text-chrome" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(s.id, s.label, 'stats')}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={statDialogOpen} onOpenChange={setStatDialogOpen}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{editingStat ? 'Edit Stat' : 'Add Stat'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Value</Label>
                <Input type="number" className="bg-[#F8F9FA] border-[#DDE3EC]" value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Suffix</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={statForm.suffix} onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Label</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Description</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={statForm.description} onChange={(e) => setStatForm({ ...statForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Icon Name (Lucide)</Label>
              <Input className="bg-[#F8F9FA] border-[#DDE3EC]" placeholder="e.g. Building2" value={statForm.iconName} onChange={(e) => setStatForm({ ...statForm, iconName: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch checked={statForm.active} onCheckedChange={(v) => setStatForm({ ...statForm, active: v })} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setStatDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveStat} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Contact Submissions Panel
  // ═══════════════════════════════════════════════════════════════
  const renderContact = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy">Contact Submissions</h2>
      </div>
      {loadingContact ? (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        </Card>
      ) : (
        <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
          {contactSubs.length === 0 ? (
            <p className="text-sm text-chrome py-8 text-center">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#DDE3EC]">
                    <TableHead className="text-chrome text-xs uppercase">Name</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Email</TableHead>
                    <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Company</TableHead>
                    <TableHead className="text-chrome text-xs uppercase hidden lg:table-cell">Message</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Date</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Status</TableHead>
                    <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactSubs.map((c) => (
                    <TableRow key={c.id} className="border-b border-[#DDE3EC]/50">
                      <TableCell className="text-sm font-medium">{c.name}</TableCell>
                      <TableCell className="text-sm text-chrome">{c.email}</TableCell>
                      <TableCell className="text-sm text-chrome hidden md:table-cell">{c.company || '—'}</TableCell>
                      <TableCell className="text-sm text-chrome hidden lg:table-cell max-w-[250px] truncate">{c.message}</TableCell>
                      <TableCell className="text-sm text-chrome whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell><ReadBadge read={c.read} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRead(c)}>
                            {c.read ? <EyeOff className="w-4 h-4 text-chrome" /> : <Eye className="w-4 h-4 text-cyan" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(c.id, c.name, 'contact')}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      )}
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER: Settings Panel
  // ═══════════════════════════════════════════════════════════════
  const renderSettings = () => (
    <Tabs defaultValue="contact" className="space-y-6">
      <TabsList className="bg-white border border-[#DDE3EC] p-1 h-auto flex-wrap">
        <TabsTrigger value="contact" className="text-sm data-[state=active]:bg-navy data-[state=active]:text-white">Contact Info</TabsTrigger>
        <TabsTrigger value="offices" className="text-sm data-[state=active]:bg-navy data-[state=active]:text-white">Offices</TabsTrigger>
        <TabsTrigger value="footer" className="text-sm data-[state=active]:bg-navy data-[state=active]:text-white">Footer</TabsTrigger>
        <TabsTrigger value="social" className="text-sm data-[state=active]:bg-navy data-[state=active]:text-white">Social</TabsTrigger>
      </TabsList>

      {/* Contact Info Tab */}
      <TabsContent value="contact">
        {loadingSettings ? (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          </Card>
        ) : (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold text-navy">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={contactInfoForm.contact_email} onChange={(e) => setContactInfoForm({ ...contactInfoForm, contact_email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Phone</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={contactInfoForm.contact_phone} onChange={(e) => setContactInfoForm({ ...contactInfoForm, contact_phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Business Hours</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={contactInfoForm.contact_hours} onChange={(e) => setContactInfoForm({ ...contactInfoForm, contact_hours: e.target.value })} />
              </div>
              <div className="pt-2">
                <Button onClick={saveContactInfo} className="bg-blue-gradient text-white hover:opacity-90">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Offices Tab */}
      <TabsContent value="offices">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Offices</h3>
          <Button onClick={() => openOfficeDialog()} className="bg-blue-gradient text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" /> Add Office
          </Button>
        </div>
        {loadingOffices ? (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          </Card>
        ) : (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#DDE3EC]">
                    <TableHead className="text-chrome text-xs uppercase">City</TableHead>
                    <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Address</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Type</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Order</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Active</TableHead>
                    <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offices.map((o) => (
                    <TableRow key={o.id} className="border-b border-[#DDE3EC]/50">
                      <TableCell className="text-sm font-medium">{o.city}</TableCell>
                      <TableCell className="text-sm text-chrome hidden md:table-cell">{o.address}</TableCell>
                      <TableCell className="text-sm text-chrome">{o.type}</TableCell>
                      <TableCell className="text-sm">{o.order}</TableCell>
                      <TableCell><ActiveBadge active={o.active} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openOfficeDialog(o)}>
                            <Pencil className="w-4 h-4 text-chrome" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(o.id, o.city, 'offices')}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        <Dialog open={officeDialogOpen} onOpenChange={setOfficeDialogOpen}>
          <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-navy">{editingOffice ? 'Edit Office' : 'Add Office'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-sm">City</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={officeForm.city} onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Address</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={officeForm.address} onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={officeForm.type} onChange={(e) => setOfficeForm({ ...officeForm, type: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Order</Label>
                  <Input type="number" className="bg-[#F8F9FA] border-[#DDE3EC]" value={officeForm.order} onChange={(e) => setOfficeForm({ ...officeForm, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch checked={officeForm.active} onCheckedChange={(v) => setOfficeForm({ ...officeForm, active: v })} />
                <Label className="text-sm">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setOfficeDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveOffice} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* Footer Tab */}
      <TabsContent value="footer">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Footer Links</h3>
          <Button onClick={() => openFooterLinkDialog()} className="bg-blue-gradient text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        </div>
        {loadingFooterLinks ? (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          </Card>
        ) : (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#DDE3EC]">
                    <TableHead className="text-chrome text-xs uppercase">Category</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Label</TableHead>
                    <TableHead className="text-chrome text-xs uppercase hidden md:table-cell">Href</TableHead>
                    <TableHead className="text-chrome text-xs uppercase">Order</TableHead>
                    <TableHead className="text-chrome text-xs uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {footerLinks.map((f) => (
                    <TableRow key={f.id} className="border-b border-[#DDE3EC]/50">
                      <TableCell className="text-sm font-medium">{f.category}</TableCell>
                      <TableCell className="text-sm">{f.label}</TableCell>
                      <TableCell className="text-sm text-chrome hidden md:table-cell">{f.href}</TableCell>
                      <TableCell className="text-sm">{f.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openFooterLinkDialog(f)}>
                            <Pencil className="w-4 h-4 text-chrome" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(f.id, f.label, 'footer-links')}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        <Dialog open={footerLinkDialogOpen} onOpenChange={setFooterLinkDialogOpen}>
          <DialogContent className="bg-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-navy">{editingFooterLink ? 'Edit Footer Link' : 'Add Footer Link'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-sm">Category</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={footerLinkForm.category} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Label</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={footerLinkForm.label} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, label: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Href</Label>
                <Input className="bg-[#F8F9FA] border-[#DDE3EC]" value={footerLinkForm.href} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, href: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Order</Label>
                <Input type="number" className="bg-[#F8F9FA] border-[#DDE3EC]" value={footerLinkForm.order} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-[#DDE3EC]" onClick={() => setFooterLinkDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveFooterLink} className="bg-blue-gradient text-white hover:opacity-90">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>

      {/* Social Tab */}
      <TabsContent value="social">
        {loadingSettings ? (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <Skeleton className="h-10 w-full" />
          </Card>
        ) : (
          <Card className="bg-white border border-[#DDE3EC] rounded-xl p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold text-navy">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Platform Names (comma-separated)</Label>
                <Input
                  className="bg-[#F8F9FA] border-[#DDE3EC]"
                  placeholder="LinkedIn, Twitter, Instagram"
                  value={socialLinksForm}
                  onChange={(e) => setSocialLinksForm(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <Button onClick={saveSocialLinks} className="bg-blue-gradient text-white hover:opacity-90">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard': return renderDashboard();
      case 'hero-about': return renderHeroAbout();
      case 'services': return renderServices();
      case 'portfolio': return renderPortfolio();
      case 'testimonials': return renderTestimonials();
      case 'team': return renderTeam();
      case 'stats': return renderStats();
      case 'contact': return renderContact();
      case 'settings': return renderSettings();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-navy z-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <span className="text-white text-xl font-bold tracking-wide">NAZERA</span>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePanel === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-cyan'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Site
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#F8F9FA]/80 backdrop-blur-sm border-b border-[#DDE3EC] px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-navy" />
          </Button>
          <h1 className="text-lg font-semibold text-navy">{panelTitle[activePanel]}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderPanel()}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-navy">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.label}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#DDE3EC]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}