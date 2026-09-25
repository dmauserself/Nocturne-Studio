/**
 * Английская версия текстов сайта.
 * Типографика: ’ (апостроф), “ ” (кавычки), — (тире), – (диапазоны). Буква после «^» в заголовке заменяется луной.
 */

export const en = {
  META: {
    lang: 'en',
    title: 'NOCTURNE STUDIO — Marketing Agency & Creative Studio',
    description:
      'NOCTURNE STUDIO builds clear brand systems: strategy, visual identity, packaging, websites and ad campaigns. Brands people recognize at a glance.',
  },

  /** Переключатель языка в шапке */
  LANG: { current: 'EN', switchTo: 'RU', switchLabel: 'Switch to Russian' },

  DEMO: {
    successTitle: 'This is a demo site',
    successText: 'The form runs in demo mode, so your message wasn’t sent anywhere. This is a concept project from a design portfolio.',
    footerNote: 'Concept project for a design portfolio. The brand, team, testimonials and case studies are fictional.',
  },

  BRAND: {
    name: 'NOCTURNE',
    suffix: 'STUDIO',
    full: 'NOCTURNE STUDIO',
    tagline: 'A marketing agency and creative studio building clear brand systems',
  },

  NAV_LEFT: [
    { label: 'Home', href: '#top' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
  ],

  NAV_RIGHT: [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Team', href: '#team' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],

  HERO: {
    eyebrow: 'Marketing agency',
    titleLines: ['Clarity first.', 'Then the system.'],
    subtitle: 'Strategy, identity and communication, shaped into one clear brand system.',
    ctaPrimary: 'Start a project',
    ctaSecondary: 'View our work',
    slides: [
      {
        title: 'Recognition',
        text: 'We build visual systems that make brands recognizable at a glance.',
        tone: 'violet' as const,
        art: 'crescent' as const,
      },
      {
        title: 'Character',
        text: 'We find a voice that sounds like your business — not like everyone else’s.',
        tone: 'indigo' as const,
        art: 'eclipse' as const,
      },
      {
        title: 'Growth',
        text: 'We turn identity into a sales tool, not a pretty PDF that gathers dust.',
        tone: 'ice' as const,
        art: 'star' as const,
      },
    ],
    stats: [
      {
        value: '100%',
        text: 'No random visuals. Only clear systems built for recognition.',
      },
      {
        value: '360°',
        text: 'Full brand presence — from strategy and identity to launch.',
      },
    ],
  },

  MARQUEE: ['Identity', 'Strategy', 'Campaigns', 'Design Systems', 'Packaging', 'Digital'],

  PRESENCE: {
    eyebrow: 'Market presence',
    side: 'Creative studio',
    titleLines: ['We shape brands with', 'clarity and structure', 'int^o recognition', 'that lasts'],
    text: 'NOCTURNE STUDIO is a marketing agency and creative studio. We build brand systems designed to work for years, not for a single season.',
    cards: [
      {
        value: 100,
        suffix: '%',
        title: 'Tailored direction',
        text: 'Every solution is shaped around the brand, its market and the audience it needs to reach.',
        variant: 'mesh' as const,
      },
      {
        value: 50,
        suffix: '+',
        title: 'Projects delivered',
        text: 'Brand systems, visual identities and campaigns for businesses that want clear, visible growth.',
        variant: 'light' as const,
      },
      {
        value: 97,
        suffix: '%',
        title: 'Client satisfaction',
        text: 'Strong results, honest communication and on-time delivery keep clients confident in the work.',
        variant: 'portrait' as const,
      },
    ],
  },

  SERVICES: {
    eyebrow: 'Services',
    title: 'What we do',
    text: 'Six disciplines that add up to one system. Each works on its own — together, they work best.',
    items: [
      {
        title: 'Brand strategy',
        text: 'We research your market and audience to find a position your competitors can’t answer.',
      },
      {
        title: 'Visual identity',
        text: 'Logo, color, typography and graphics — assembled into one system with clear rules.',
      },
      {
        title: 'Packaging design',
        text: 'Packaging that gets picked off the shelf in three seconds and kept long after the purchase.',
      },
      {
        title: 'Web & digital',
        text: 'Websites and product interfaces that sell as confidently as they look.',
      },
      {
        title: 'Ad campaigns',
        text: 'Idea, visuals and media plan. Campaigns people talk about, with numbers that move.',
      },
      {
        title: 'Brand stewardship',
        text: 'We keep the system in shape: new touchpoints, guidelines and quality control at every step.',
      },
    ],
  },

  PHILOSOPHY: {
    eyebrow: 'Philosophy',
    titleLines: ['Clear', 'brands stay', 'in mem^ory.'],
    paragraphs: [
      'A brand becomes truly memorable when people can understand it quickly and recognize it without extra effort. Clarity creates the first strong connection.',
      'Consistency turns that connection into lasting trust. When the same visual logic appears across every touchpoint, the brand starts to feel familiar.',
      'Recognition is never a random effect. It’s built through form, contrast, repetition and a clear system that keeps the brand present in people’s minds.',
    ],
    cta: 'Start a project',
    identity: { label: 'Identity scope', price: 'from $18,000', progressLabel: 'Progress', progress: 70 },
    campaign: { label: 'Campaign scope', price: 'from $11,500' },
  },

  PROJECTS: {
    eyebrow: 'Selected work',
    title: 'Case studies',
    text: 'A few stories of how a clear system changes the way a brand is seen — and the numbers behind it.',
    cta: 'View case',
    items: [
      { name: 'Polaris', category: 'Identity · Fintech', year: '2025', palette: ['#7C5CFF', '#2A1B5E', '#8FB4FF'] },
      { name: 'Northern Honey', category: 'Packaging · FMCG', year: '2025', palette: ['#B9A6FF', '#2A1B5E', '#9B5CFF'] },
      { name: 'Atlas Development', category: 'Strategy · Real estate', year: '2024', palette: ['#9B5CFF', '#0F0A1E', '#7C5CFF'] },
      { name: 'Lumen', category: 'Digital · EdTech', year: '2024', palette: ['#8FB4FF', '#2A1B5E', '#B9A6FF'] },
      { name: 'Graphite Coffee', category: 'Campaign · Hospitality', year: '2024', palette: ['#EDE9FF', '#2A1B5E', '#7C5CFF'] },
      { name: 'Orbit Clinic', category: 'Brand system · Healthcare', year: '2023', palette: ['#7C5CFF', '#05030A', '#8FB4FF'] },
    ],
  },

  PROCESS: {
    eyebrow: 'Process',
    title: 'How we work',
    text: 'Five phases, like the phases of the moon — from the unknown to complete clarity.',
    steps: [
      { title: 'Immersion', text: 'Interviews with your team and a deep look at the market, competitors and audience. We learn how your business really works.', time: '1–2 weeks' },
      { title: 'Strategy', text: 'We define positioning, the brand platform and tone of voice — and agree on exactly where we’re heading.', time: '2–3 weeks' },
      { title: 'Identity', text: 'We build the visual system: mark, color, type, graphics and the rules that hold it all together.', time: '3–5 weeks' },
      { title: 'Launch', text: 'We roll the brand out across every touchpoint — site, packaging, social, ads — with nothing lost along the way.', time: '2–4 weeks' },
      { title: 'Growth', text: 'We support, measure and strengthen. The system grows as your business does.', time: 'Ongoing' },
    ],
  },

  TEAM: {
    eyebrow: 'Team',
    title: 'The people behind the system',
    text: 'A small team of senior specialists. You work directly with the people doing the work — no middlemen.',
    members: [
      { name: 'Alice Vance', role: 'Founder, Creative Director' },
      { name: 'Mark Levin', role: 'Brand Strategist' },
      { name: 'Vera Sokol', role: 'Art Director' },
      { name: 'Daniel Orr', role: 'Head of Digital' },
    ],
  },

  TESTIMONIALS: {
    eyebrow: 'Testimonials',
    title: 'What clients say',
    items: [
      {
        quote: 'In four months we went from “just another bank” to a brand people recognize by a single color. Digital leads grew by 38%.',
        name: 'Olivia West',
        role: 'CMO, Polaris',
      },
      {
        quote: 'NOCTURNE didn’t make pretty pictures for their own sake. They understood our business first — then built packaging that sells itself.',
        name: 'Ian Sutton',
        role: 'Founder, Northern Honey',
      },
      {
        quote: 'A rare partner who hits every deadline and still pushes back when it matters. Our guidelines have run for three years without a single revision.',
        name: 'Kate Lawson',
        role: 'Marketing Director, Atlas Development',
      },
      {
        quote: 'The website and the identity finally tell one story. Conversion doubled — and the team stopped arguing about fonts.',
        name: 'Aaron Kraft',
        role: 'CEO, Lumen',
      },
    ],
  },

  FAQ: {
    eyebrow: 'FAQ',
    title: 'Questions, answered',
    items: [
      {
        q: 'How long does a project take?',
        a: 'A visual identity takes 6–10 weeks; strategy plus identity starts at three months. You’ll get a detailed, stage-by-stage timeline after our first call.',
      },
      {
        q: 'How much does it cost?',
        a: 'Identity projects start at $18,000 and campaigns at $11,500. The final price depends on scope and the number of touchpoints. We fix the estimate in the contract and never change it midway.',
      },
      {
        q: 'What does the process look like?',
        a: 'Immersion, strategy, identity, launch and growth. Every stage ends with a presentation and your sign-off. You get one dedicated project lead and a shared channel with the team.',
      },
      {
        q: 'Who owns the final files?',
        a: 'You do. Once the final invoice is paid, we transfer full ownership of all approved work and source files to you.',
      },
      {
        q: 'Do you work with clients remotely?',
        a: 'Yes — most of our clients are remote. We meet online and fly in for strategy sessions when it really matters.',
      },
      {
        q: 'What do you need to get started?',
        a: 'A short brief and a 30-minute call. We’ll request everything else ourselves and send you a project plan within three business days.',
      },
    ],
  },

  CONTACT: {
    eyebrow: 'Contact',
    titleLines: ['Let’s build a brand', 'people remember'],
    text: 'Tell us about your project. We’ll reply within one business day and suggest a time for a call.',
    budgets: ['Under $10k', '$10k – $25k', '$25k – $50k', '$50k+'],
    fields: {
      name: 'Your name',
      contact: 'Email or phone',
      task: 'Tell us about the project',
      budget: 'Budget',
    },
    placeholders: {
      name: 'Jane Cooper',
      contact: 'jane@company.com',
      task: 'e.g. We’re rebranding a chain of coffee shops and need new packaging',
    },
    submit: 'Send request',
    sending: 'Sending…',
    successTitle: 'Request sent',
    successText: 'Thank you! We’re already reading your message and will get back to you within one business day.',
    successReset: 'Send another',
    error: 'We couldn’t send your request. Please try again or email us directly:',
    privacy: 'By submitting this form, you agree to the processing of your personal data.',
    privacyLink: 'Privacy policy',
    privacyHref: '/privacy-en.html',
    errors: {
      name: 'Please tell us your name',
      contact: 'Enter a valid email or phone number',
      task: 'Tell us a little more — a sentence or two is enough',
      budget: 'Choose an approximate budget',
    },
  },

  FOOTER: {
    email: 'hello@nocturne.studio',
    phone: '+1 (212) 555-0147',
    phoneHref: '+12125550147',
    address: 'Brooklyn, New York',
    headings: { nav: 'Navigation', contact: 'Contact', social: 'Social' },
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'Behance', href: 'https://behance.net/' },
      { label: 'Dribbble', href: 'https://dribbble.com/' },
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
    ],
    disclaimer: '',
    copyright: `© ${new Date().getFullYear()} NOCTURNE STUDIO. All rights reserved.`,
  },

  A11Y: {
    skip: 'Skip to content',
    hero: 'Introduction',
    loading: 'Loading',
    home: 'Back to top',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    menu: 'Menu',
    navLeft: 'Main navigation',
    navRight: 'Secondary navigation',
    navMobile: 'Mobile navigation',
    navFooter: 'Footer navigation',
    carousel: 'carousel',
    principles: 'Our principles',
    toServices: 'Go to services',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    prevCard: 'Previous card',
    nextCard: 'Next card',
    marquee: 'What we do',
    about: 'About the studio',
    discuss: (title: string) => `${title}: discuss this service`,
    viewCase: (name: string, category: string, year: string) => `${name}, ${category}, ${year}. View case`,
    portrait: (name: string) => `Portrait of ${name}`,
    slider: 'slider',
    reviews: 'Client testimonials',
    chooseReview: 'Choose a testimonial',
    review: (i: number, name: string) => `Testimonial ${i}: ${name}`,
    prevReview: 'Previous testimonial',
    nextReview: 'Next testimonial',
    contact: 'Contact us',
    honeypot: 'Leave this field empty',
  },
}

export type Content = typeof en
