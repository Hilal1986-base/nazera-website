import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  // ─── Site Settings ────────────────────────────────
  const settings = [
    { key: 'hero_headline', value: 'Building the Future,' },
    { key: 'hero_headline_accent', value: 'Today' },
    { key: 'hero_subtitle', value: 'A premier multinational company delivering excellence across real estate, technology, energy, and finance — shaping industries and empowering futures worldwide.' },
    { key: 'hero_cta_primary', value: 'Explore Our Services' },
    { key: 'hero_cta_secondary', value: 'Learn More' },
    { key: 'about_subtitle', value: 'About Us' },
    { key: 'about_headline_part1', value: 'A Legacy of' },
    { key: 'about_headline_accent1', value: 'Vision' },
    { key: 'about_headline_connector', value: 'and' },
    { key: 'about_headline_accent2', value: 'Impact' },
    { key: 'about_paragraph1', value: 'Founded in 2001, NAZERA has grown from a regional investment firm into a diversified multinational conglomerate with operations spanning 30+ countries. Our portfolio encompasses real estate development, technology solutions, renewable energy, financial services, and strategic consulting.' },
    { key: 'about_paragraph2', value: 'We believe in creating lasting value — for our partners, our communities, and the global economy. Every decision we make is guided by integrity, innovation, and an unwavering commitment to excellence.' },
    { key: 'about_founding_year', value: '2001' },
    { key: 'about_floating_stat', value: '25+' },
    { key: 'about_floating_label', value: 'Years of Excellence' },
    { key: 'contact_email', value: 'inquiries@nazera.com' },
    { key: 'contact_phone', value: '+971 4 123 4567' },
    { key: 'contact_hours', value: 'Sun – Thu: 9 AM – 6 PM (GST)' },
    { key: 'footer_stats_1_value', value: '30+' },
    { key: 'footer_stats_1_label', value: 'Countries' },
    { key: 'footer_stats_2_value', value: '5,000+' },
    { key: 'footer_stats_2_label', value: 'Employees' },
    { key: 'footer_stats_3_value', value: '$12B+' },
    { key: 'footer_stats_3_label', value: 'Revenue' },
    { key: 'footer_stats_4_value', value: '200+' },
    { key: 'footer_stats_4_label', value: 'Projects' },
    { key: 'footer_description', value: "Building tomorrow's world today through strategic investments, innovation, and sustainable growth." },
    { key: 'social_links', value: JSON.stringify(['LinkedIn', 'Twitter', 'Instagram']) },
    { key: 'admin_password', value: 'nazera2024' },
  ];

  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // ─── Services ─────────────────────────────────────
  const services = [
    { title: 'Real Estate Development', description: 'Premium residential, commercial, and mixed-use developments across global markets. From concept to completion, we deliver landmark projects that redefine skylines and communities.', icon: 'Building2', features: JSON.stringify(['Luxury Residences', 'Commercial Hubs', 'Mixed-Use']), order: 0 },
    { title: 'Technology Solutions', description: 'Cutting-edge IT infrastructure, AI-driven platforms, and digital transformation services that help businesses scale and compete in the digital age.', icon: 'Cpu', features: JSON.stringify(['AI & Automation', 'Cloud', 'Cybersecurity']), order: 1 },
    { title: 'Energy & Renewables', description: 'Sustainable energy projects including solar, wind, and hybrid installations. We are committed to powering the future while protecting the planet.', icon: 'Zap', features: JSON.stringify(['Solar Farms', 'Wind Energy', 'Green Consulting']), order: 2 },
    { title: 'Financial Services', description: 'Comprehensive financial advisory, asset management, and investment banking services tailored to high-net-worth individuals and institutional investors.', icon: 'Landmark', features: JSON.stringify(['Wealth Management', 'Investment Banking', 'Risk Advisory']), order: 3 },
    { title: 'Strategic Consulting', description: 'Expert advisory services for market entry, mergers & acquisitions, operational optimization, and long-term growth strategy across industries.', icon: 'Users', features: JSON.stringify(['M&A Advisory', 'Market Entry', 'Growth Strategy']), order: 4 },
  ];

  for (const s of services) {
    await db.service.create({ data: s });
  }

  // ─── Portfolio ────────────────────────────────────
  const projects = [
    { title: 'Azure Towers Dubai', category: 'Real Estate', location: 'Dubai, UAE', description: 'A 72-story mixed-use luxury tower featuring 450 premium residences and world-class amenities.', stats: '$2.1B Value', order: 0 },
    { title: 'SmartGrid Platform', category: 'Technology', location: 'Global SaaS', description: 'An AI-powered energy management platform deployed across 200+ industrial facilities.', stats: '200+ Deployments', order: 1 },
    { title: 'Sahara Solar Complex', category: 'Energy', location: 'Morocco', description: "One of North Africa's largest solar installations, generating 850MW of clean energy.", stats: '850 MW', order: 2 },
    { title: 'Meridian Capital Fund', category: 'Finance', location: 'London, UK', description: 'A $3.5 billion diversified investment fund focusing on emerging market equities.', stats: '$3.5B AUM', order: 3 },
    { title: 'Nexus Business Park', category: 'Real Estate', location: 'Singapore', description: 'A 15-acre LEED Platinum business campus housing Fortune 500 tenants.', stats: 'LEED Platinum', order: 4 },
    { title: 'CloudForge AI', category: 'Technology', location: 'San Francisco', description: 'Enterprise AI development platform serving over 500 enterprise clients globally.', stats: '500+ Clients', order: 5 },
  ];

  for (const p of projects) {
    await db.portfolioProject.create({ data: p });
  }

  // ─── Testimonials ─────────────────────────────────
  const testimonials = [
    { name: 'Ahmed Al-Rashid', role: 'CEO, Al-Rashid Holdings', text: 'NAZERA transformed our real estate portfolio strategy. Their market insights and execution capabilities are unmatched in the region.', initials: 'AR', order: 0 },
    { name: 'Dr. Elena Vasquez', role: 'Director, GreenTech Foundation', text: "Their commitment to sustainable energy is genuine. The Sahara Solar Complex is a testament to NAZERA's ability to deliver economically viable and environmentally responsible projects.", initials: 'EV', order: 1 },
    { name: 'Michael Park', role: 'CTO, DataStream Inc.', text: "CloudForge AI has been transformative for our operations. NAZERA's technology division understood our needs at a fundamental level and delivered a platform that scaled beyond expectations.", initials: 'MP', order: 2 },
  ];

  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // ─── Team ─────────────────────────────────────────
  const team = [
    { name: 'Khalid Al-Nazari', role: 'Chairman & CEO', bio: 'Over 30 years of global business leadership. Former senior advisor to sovereign wealth funds across the GCC.', initials: 'KN', order: 0 },
    { name: 'Sarah Mitchell', role: 'Chief Operating Officer', bio: 'Ex-McKinsey partner with deep expertise in operational transformation across emerging markets.', initials: 'SM', order: 1 },
    { name: 'James Chen', role: 'Chief Technology Officer', bio: 'Serial tech entrepreneur with three successful exits. Pioneer in enterprise AI and cloud architecture.', initials: 'JC', order: 2 },
    { name: 'Amira Hassan', role: 'VP of Investments', bio: 'CFA charterholder and former Goldman Sachs MD specializing in cross-border M&A.', initials: 'AH', order: 3 },
  ];

  for (const t of team) {
    await db.teamMember.create({ data: t });
  }

  // ─── Stats ────────────────────────────────────────
  const stats = [
    { value: 200, suffix: '+', label: 'Projects Delivered', description: 'Across 30+ countries on every continent', iconName: 'Building2', order: 0 },
    { value: 5000, suffix: '+', label: 'Team Members', description: 'Diverse talent driving innovation globally', iconName: 'Users', order: 1 },
    { value: 30, suffix: '+', label: 'Countries', description: 'With a presence in every major region', iconName: 'Globe', order: 2 },
    { value: 85, suffix: '+', label: 'Industry Awards', description: 'Recognized for excellence and sustainability', iconName: 'Award', order: 3 },
  ];

  for (const s of stats) {
    await db.stat.create({ data: s });
  }

  // ─── Offices ──────────────────────────────────────
  const offices = [
    { city: 'Dubai, UAE', address: 'DIFC, Gate Avenue, Tower 3, Level 28', type: 'Global Headquarters', order: 0 },
    { city: 'London, UK', address: '25 Old Broad Street, EC2N 1HQ', type: 'European Office', order: 1 },
    { city: 'Singapore', address: '1 Raffles Place, #44-02, Tower 2', type: 'Asia Pacific Office', order: 2 },
  ];

  for (const o of offices) {
    await db.office.create({ data: o });
  }

  // ─── About Highlights ─────────────────────────────
  const highlights = [
    { text: 'Strategic investments across emerging and established markets', order: 0 },
    { text: 'End-to-end project delivery with global expertise', order: 1 },
    { text: 'Commitment to sustainability and innovation', order: 2 },
    { text: 'Partnership-driven approach with long-term vision', order: 3 },
  ];

  for (const h of highlights) {
    await db.aboutHighlight.create({ data: h });
  }

  // ─── Footer Links ─────────────────────────────────
  const footerLinks = [
    { category: 'Company', label: 'About Us', order: 0 },
    { category: 'Company', label: 'Our Team', order: 1 },
    { category: 'Company', label: 'Careers', order: 2 },
    { category: 'Company', label: 'News & Media', order: 3 },
    { category: 'Services', label: 'Real Estate', order: 0 },
    { category: 'Services', label: 'Technology', order: 1 },
    { category: 'Services', label: 'Energy', order: 2 },
    { category: 'Services', label: 'Finance', order: 3 },
    { category: 'Services', label: 'Consulting', order: 4 },
    { category: 'Resources', label: 'Case Studies', order: 0 },
    { category: 'Resources', label: 'Annual Reports', order: 1 },
    { category: 'Resources', label: 'ESG Policy', order: 2 },
    { category: 'Resources', label: 'Investor Relations', order: 3 },
    { category: 'Legal', label: 'Privacy Policy', order: 0 },
    { category: 'Legal', label: 'Terms of Service', order: 1 },
    { category: 'Legal', label: 'Cookie Policy', order: 2 },
    { category: 'Legal', label: 'Compliance', order: 3 },
  ];

  for (const fl of footerLinks) {
    await db.footerLink.create({ data: fl });
  }

  console.log('✅ Seed completed successfully!');
}

seed()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());