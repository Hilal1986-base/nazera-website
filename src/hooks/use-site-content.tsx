'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteContent {
  settings: Record<string, string>;
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string;
    order: number;
    active: boolean;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    category: string;
    location: string;
    description: string;
    stats: string;
    order: number;
    active: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    text: string;
    initials: string;
    active: boolean;
    order: number;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    initials: string;
    linkedin: string;
    email: string;
    active: boolean;
    order: number;
  }>;
  stats: Array<{
    id: string;
    value: number;
    suffix: string;
    label: string;
    description: string;
    iconName: string;
    order: number;
    active: boolean;
  }>;
  offices: Array<{
    id: string;
    city: string;
    address: string;
    type: string;
    order: number;
    active: boolean;
  }>;
  highlights: Array<{
    id: string;
    text: string;
    order: number;
    active: boolean;
  }>;
  footerLinks: Array<{
    id: string;
    category: string;
    label: string;
    href: string;
    order: number;
  }>;
}

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch('/site-content')
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {});
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}