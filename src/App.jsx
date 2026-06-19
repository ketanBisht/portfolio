import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring, useTransform, motionValue
} from 'framer-motion';
import {
  ArrowUpRight, ExternalLink, Send, Mail,
  Sun, Moon, Download,
  CheckCircle, Zap, Shield, Code2, Cpu, Server,
  ChevronRight, MessageSquare, Tag
} from 'lucide-react';
import './App.css';

/* ─── Brand SVG Icons ────────────────────────────────────────────────────── */
const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const XIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ─── Framer helpers ─────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, delay } },
});
const slideLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay } },
});
const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
});
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const staggerFast = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.0 } } };

/* ─── Letter-by-letter text animation ── */
function AnimatedText({ text, className, delay = 0 }) {
  const letters = Array.from(text);
  return (
    <motion.span
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: delay } } }}
      initial="hidden"
      animate="show"
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
          variants={{
            hidden: { opacity: 0, y: 28, rotateX: -90 },
            show:   { opacity: 1, y: 0,  rotateX: 0,  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
        >{ch}</motion.span>
      ))}
    </motion.span>
  );
}

/* ─── Animated counter ── */
function Counter({ target, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target, 10);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / 40);
    const id = setTimeout(() => {
      const interval = setInterval(() => {
        start = Math.min(start + step, num);
        setCount(start);
        if (start >= num) clearInterval(interval);
      }, 30);
    }, delay * 1000);
    return () => clearTimeout(id);
  }, [inView, target, delay]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── 3-D tilt card wrapper ── */
function TiltCard({ children, className, style, intensity = 12, ...rest }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [x, y]);
  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      {...rest}
    >{children}</motion.div>
  );
}

/* ─── Magnetic button wrapper ── */
function MagneticBtn({ children, className, onClick, ...rest }) {
  const btnRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 25 });
  const sy = useSpring(y, { stiffness: 350, damping: 25 });

  const handleMouse = useCallback((e) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.35);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.35);
  }, [x, y]);
  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button
      ref={btnRef}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      {...rest}
    >{children}</motion.button>
  );
}

/* ─── Scroll progress bar ── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      setProgress(window.scrollY / (h.scrollHeight - h.clientHeight));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, height: '2px',
        background: 'var(--amber)', zIndex: 9998,
        scaleX: progress, transformOrigin: '0%',
      }}
    />
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const SECTIONS    = ['home', 'projects', 'services', 'about', 'skills', 'contact'];
const NAV_LABELS  = ['Home', 'Projects', 'Services', 'About', 'Resume', 'Contact'];

const SOCIALS = [
  { label: 'GitHub',   Icon: GithubIcon,  href: 'https://github.com/ketanbisht',                      tip: 'GitHub' },
  { label: 'LinkedIn', Icon: LinkedinIcon, href: 'https://www.linkedin.com/in/ketan-bisht-4b782b25b/', tip: 'LinkedIn' },
  { label: 'X',        Icon: XIcon,        href: 'https://x.com/theketanBisht',                        tip: 'X / Twitter' },
  { label: 'Email',    Icon: Mail,         href: 'mailto:ketan.work30@gmail.com',                      tip: 'Email' },
];

/* ── Projects — the real centrepiece ── */
const PROJECTS = [
  {
    id: 'fitshit',
    name: 'FitShit',
    tagline: 'Multi-Tenant Gym Management SaaS',
    desc: 'Full-stack multi-tenant SaaS where each gym owner gets a branded subdomain, an admin dashboard with revenue analytics, member lifecycle management, custom pricing plans, and automated email announcements.',
    challenge: 'Design true multi-tenancy so gym owners manage their own members in complete isolation from every other gym on the same system.',
    solution: 'Subdomain-based tenant routing in Next.js + NestJS RolesGuard/JwtAuthGuard scoped per tenant. Bulk email fires only to ACTIVE members on each announcement.',
    tech: ['Next.js 14', 'NestJS', 'PostgreSQL', 'Prisma', 'JWT', 'Nodemailer', 'Docker'],
    category: 'saas',
    featured: true,
    github: 'https://github.com/ketanBisht/fitshit',
    live: 'https://fitshit.vercel.app/',
    color: '#E8A820',
    icon: '🏋️',
  },
  {
    id: 'skills-on-chain',
    name: 'SkillsOnChain',
    tagline: 'Decentralised Credential Platform — Solana',
    desc: 'Authorized institutions mint non-transferable Soulbound Tokens onto a user\'s Solana wallet as tamper-proof proof of skills. Features time-locked employer portfolio sharing and public credential verification.',
    challenge: 'Traditional certificates are trivially faked. Build a trustless, on-chain credentialing system that non-crypto users can actually interact with.',
    solution: 'Custom Anchor/Rust smart contract with PDAs + role-based on-chain governance (Admin → Issuer → User). Nonce-signing wallet auth replaces passwords entirely.',
    tech: ['Solana', 'Anchor', 'Rust', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'IPFS'],
    category: 'blockchain',
    featured: true,
    github: 'https://github.com/ketanBisht/chainCertificateSystem',
    live: 'https://skillsonchain.vercel.app/',
    color: '#9945FF',
    icon: '🔗',
  },
  {
    id: 'batuwa',
    name: 'Batuwa',
    tagline: 'Non-Custodial Multi-Chain Crypto Wallet',
    desc: 'A fully self-sovereign HD wallet for Solana and Ethereum, deployable as both a web app and a Chrome extension. One 12-word BIP39 seed phrase generates accounts for both chains — zero server ever touches your keys.',
    challenge: 'Support both Ethereum (secp256k1) and Solana (ed25519) key derivation in a single browser-based app with encrypted local storage and no server exposure.',
    solution: 'Independent chain modules with live RPC balance fetching via Alchemy. AES-encrypted mnemonic in localStorage, dual deployment via manifest.json for Chrome extension.',
    tech: ['React 19', 'Vite', 'ethers.js v6', '@solana/web3.js', 'BIP39', 'TweetNaCl', 'CryptoJS', 'Tailwind CSS 4'],
    category: 'blockchain',
    featured: false,
    github: 'https://github.com/ketanBisht/batuwa',
    live: 'https://batuwa-home.vercel.app/',
    npm: 'https://chromewebstore.google.com/detail/batuwa-wallet/bmcinobeebahpnbpgjphaengofjiigai',
    color: '#14F195',
    icon: '🪙',
  },
  {
    id: 'brutalistic',
    name: 'Brutalistic',
    tagline: 'Open-Source Neobrutalist React UI Library — npm',
    desc: 'Published npm package (@k10_here/brutalistic) with 18+ production-ready components — Button, Modal, Tabs, Accordion, Marquee, CustomCursor and more — using a strict Neobrutalist design system (thick borders, offset shadows, Yellow/Black/White palette).',
    challenge: 'Most UI libraries trend soft and minimal. Fill the gap for developers who want a visually distinct, high-contrast Neobrutalist design system without building one from scratch.',
    solution: 'Vite library mode with dual ESM + CJS output, class-variance-authority for variants, vite-plugin-dts for type generation, and a live Vercel doc site serving as an interactive playground.',
    tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite', 'CVA', 'clsx', 'lucide-react'],
    category: 'library',
    featured: false,
    github: 'https://github.com/ketanBisht/brutalistic',
    live: 'https://brutalistic.vercel.app/',
    npm: 'https://www.npmjs.com/package/@k10_here/brutalistic',
    color: '#FF6B6B',
    icon: '🏗️',
  },
  {
    id: 'shawty',
    name: 'Shawty',
    tagline: 'Full-Stack URL Shortener — Neobrutalist UI',
    desc: 'Paste a long URL, get a shareable short link instantly. Features deterministic MD5 hashing for deduplication, a dual-layer in-memory cache for sub-millisecond redirects, click tracking, custom aliases, and IP-based rate limiting.',
    challenge: 'Build a fast, idempotent URL shortener where the same long URL always maps to the same short ID without redundant DB writes.',
    solution: 'MD5 → base64url shortId generation for determinism. In-memory Map cache in front of PostgreSQL for near-instant redirects. Rate limiter built from scratch inside the cache class.',
    tech: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS 4', 'Framer Motion'],
    category: 'tools',
    featured: false,
    github: 'https://github.com/ketanBisht/shawty',
    live: 'https://shawty.vercel.app/',
    color: '#00D4FF',
    icon: '🔗',
  },
  {
    id: 'unfair-wiki',
    name: 'UnfairWiki',
    tagline: 'Real-Time Multiplayer Wikipedia Race — with Chaos',
    desc: 'Multiplayer Wikipedia race game where players navigate from one article to a target by clicking internal links — but a server-side Chaos Engine randomly teleports everyone mid-race, so no lead is ever safe. Up to 8 players per room.',
    challenge: 'Intercept Wikipedia\'s internal links inside a sandboxed game UI and handle all real-time edge cases: disconnects, last-player-standing, rematch resets.',
    solution: 'Custom Express proxy fetches Wikipedia via API, then uses Cheerio to parse and rewrite every link. Socket.io room architecture broadcasts chaos events and tracks each player\'s full navigation path.',
    tech: ['React 18', 'Vite', 'Socket.io', 'Node.js', 'Express', 'Cheerio', 'Framer Motion'],
    category: 'game',
    featured: false,
    github: 'https://github.com/ketanBisht/game/tree/main/unfairWiki',
    live: 'https://unfairwiki.vercel.app/',
    color: '#F97316',
    icon: '🏁',
  },
  {
    id: 'matchit',
    name: 'matchIT',
    tagline: 'Color Memory Challenge Game',
    desc: 'Browser-based color memory game. A random color flashes for 3 seconds — then recreate it from memory using a custom Canvas-rendered HSV color wheel. Accuracy scored via Euclidean distance in RGB space across 5 rounds.',
    challenge: 'Build a precise color picker from scratch with no third-party library, and score accuracy mathematically rather than by visual comparison.',
    solution: 'Canvas color wheel procedurally generated pixel-by-pixel using trigonometry + HSV math. Scoring uses normalized Euclidean distance in RGB space (√(255²×3) as max). Single finite state machine drives all game phases.',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Framer Motion', 'Tailwind CSS 4'],
    category: 'game',
    featured: false,
    github: 'https://github.com/ketanBisht/matchit',
    live: 'https://matchitt.vercel.app/',
    color: '#A855F7',
    icon: '🎮',
  },
  {
    id: 'joking-terminal',
    name: 'joking-terminal',
    tagline: 'npm CLI — Random Jokes in Your Terminal',
    desc: 'A lightweight Node.js CLI that delivers random jokes straight to your terminal. Supports category filtering (programming, general, knock-knock), built with Commander.js for a clean CLI experience.',
    challenge: 'Build a zero-friction, fun developer tool that is genuinely useful during long coding sessions without any UI overhead.',
    solution: 'Commander.js for clean flag-based CLI design. Fetches from the Official Joke API and renders jokes in a minimal, readable terminal format. Installable globally via npm.',
    tech: ['Node.js', 'Commander.js', 'Official Joke API', 'npm CLI'],
    category: 'cli',
    featured: false,
    github: 'https://github.com/ketanBisht/joking-terminal',
    npm: 'https://www.npmjs.com/package/joking-terminal',
    color: '#22C55E',
    icon: '😂',
  },
];

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'SaaS Products', value: 'saas' },
  { label: 'Blockchain / Web3', value: 'blockchain' },
  { label: 'Games', value: 'game' },
  { label: 'Tools & Libraries', value: 'tools' },
  { label: 'OSS Library', value: 'library' },
  { label: 'CLI Tools', value: 'cli' },
];

const SERVICES = [
  {
    icon: Code2,
    title: 'Full Stack Web Apps',
    desc: 'End-to-end SaaS products, dashboards and admin panels. I own the full stack — schema to UI — and ship clean, maintainable code.',
    tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    highlight: true,
  },
  {
    icon: Cpu,
    title: 'Blockchain & Web3',
    desc: 'Solana programs, Ethereum smart contracts, DeFi protocols and NFT platforms built with security and gas efficiency in mind.',
    tech: ['Solana', 'Anchor', 'Rust', 'Ethers.js', 'Solidity'],
    highlight: false,
  },
  {
    icon: Server,
    title: 'APIs & Backend Systems',
    desc: 'Scalable REST/GraphQL APIs, microservice architectures, database design and cloud deployment on AWS/GCP.',
    tech: ['Node.js', 'TypeScript', 'Docker', 'AWS', 'Redis'],
    highlight: false,
  },
];

const SKILLS_A = [
  { name: 'React / Next.js',   pct: 80 },
  { name: 'Node.js / Express', pct: 75 },
  { name: 'TypeScript',        pct: 72 },
  { name: 'Solana / Anchor',   pct: 68 },
];
const SKILLS_B = [
  { name: 'Rust',              pct: 55 },
  { name: 'PostgreSQL',        pct: 70 },
  { name: 'Docker',            pct: 60 },
  { name: 'Tailwind CSS',      pct: 82 },
];

const EXPERIENCE = [
  {
    period: '2025 – Present',
    role: 'Freelance Developer',
    company: 'Self-directed',
    desc: 'Building and shipping real-world projects — SaaS platforms, blockchain apps, UI libraries, and CLI tools. Actively looking for my first paying clients.',
  },
  {
    period: '2024 – 2025',
    role: 'Blockchain & Web3 Projects',
    company: 'Personal Projects',
    desc: 'Built SkillsOnChain (Solana SBT credentialing system with Rust/Anchor smart contracts) and Batuwa (non-custodial multi-chain HD wallet + Chrome extension).',
  },
  {
    period: '2023 – 2024',
    role: 'Full Stack & OSS',
    company: 'Personal Projects',
    desc: 'Built FitShit (multi-tenant gym SaaS), Shawty (URL shortener), UnfairWiki (multiplayer game), matchIT (color game), and published Brutalistic on npm.',
  },
];

/* ─── Cursor ─────────────────────────────────────────────────────────────── */
function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  const [label, setLabel] = useState('');
  useEffect(() => {
    const mv = e => setPos({ x: e.clientX, y: e.clientY });
    const ov = e => {
      const el = e.target.closest('a,button,input,textarea,select');
      setHov(!!el);
      setLabel(el?.dataset?.cursor || '');
    };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseover', ov);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseover', ov); };
  }, []);
  return (
    <>
      <motion.div
        style={{
          position:'fixed', borderRadius:'50%',
          background: hov ? 'rgba(232,168,32,0.15)' : 'var(--amber)',
          border: hov ? '1.5px solid var(--amber)' : 'none',
          pointerEvents:'none', zIndex:9999, top:0, left:0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.55rem', fontWeight: 700, color: 'var(--text)',
          letterSpacing: '0.04em', backdropFilter: hov ? 'blur(4px)' : 'none',
        }}
        animate={{
          width: hov ? 56 : 9, height: hov ? 56 : 9,
          x: pos.x - (hov ? 28 : 4.5),
          y: pos.y - (hov ? 28 : 4.5),
        }}
        transition={{ type:'spring', stiffness:480, damping:30 }}
      >
        {hov && label && <span style={{ whiteSpace:'nowrap', userSelect:'none' }}>{label}</span>}
      </motion.div>
      <motion.div
        style={{ position:'fixed', width:5, height:5, borderRadius:'50%', background:'var(--amber)', pointerEvents:'none', zIndex:10000, top:0, left:0 }}
        animate={{ x:pos.x-2.5, y:pos.y-2.5 }}
        transition={{ type:'spring', stiffness:1000, damping:40 }}
      />
    </>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ active, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-logo" onClick={() => scrollTo('home')}>
        <span className="logo-circle" />
        <span className="logo-circle logo-circle-2" />
      </div>

      <nav className="nav-links">
        {NAV_LABELS.map((lbl, i) => (
          <motion.button
            key={lbl}
            className={`nav-link ${active === SECTIONS[i] ? 'active' : ''}`}
            onClick={() => scrollTo(SECTIONS[i])}
            whileTap={{ scale: 0.95 }}
          >
            {lbl}
          </motion.button>
        ))}
      </nav>

      <div className="nav-right">
        <div className="nav-status">
          <span className="nav-status-dot" />
          Open to work
        </div>
        <motion.button
          className="nav-hire-btn"
          onClick={() => scrollTo('contact')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Let's Talk <ArrowUpRight size={13} />
        </motion.button>
        <motion.button className="nav-theme-btn" onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </motion.button>
      </div>
    </motion.header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact  = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="hero">
      <div className="hero-left">

        {/* Availability badge */}
        <motion.div
          className="avail-badge"
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.16,1,0.3,1] }}
        >
          <span className="avail-dot" />
          Looking for my first freelance clients
        </motion.div>

        {/* Name — letter-by-letter flip */}
        <div className="hero-name-row">
          <AnimatedText text="KETAN BISHT" className="hero-name" delay={0.1} />
        </div>

        {/* Tagline */}
        <motion.h1
          className="hero-big"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          i write code<br /><span className="hero-big-accent">that works.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Full Stack Developer &amp; Blockchain Engineer. I build real, shipped products —
          SaaS platforms, Web3 apps, UI libraries, and CLI tools. Now actively looking
          for my first freelance clients.
        </motion.p>

        {/* Magnetic CTAs */}
        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
        >
          <MagneticBtn className="hero-cta-primary" onClick={scrollToProjects} data-cursor="View">
            See My Projects <ArrowUpRight size={16} />
          </MagneticBtn>
          <MagneticBtn className="hero-cta-secondary" onClick={scrollToContact} data-cursor="Chat">
            Get in Touch
          </MagneticBtn>
        </motion.div>

        {/* Perks block */}
        <motion.div
          className="hero-perks-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <div className="hero-perks-title">Why work with me?</div>
          <div className="hero-perks-grid">
            {[
              { icon: Zap,           text: 'Undivided attention on your project' },
              { icon: Tag,           text: 'Competitive intro rates' },
              { icon: CheckCircle,   text: '8 shipped, real-world projects' },
              { icon: MessageSquare, text: 'Daily updates, zero ghosting' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i} className="hero-perk-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.05 + i * 0.07, duration: 0.45 }}
              >
                <div className="hero-perk-icon"><Icon size={14} strokeWidth={2} /></div>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Socials */}
        <motion.div
          className="hero-socials"
          variants={staggerFast}
          initial="hidden"
          animate="show"
        >
          {SOCIALS.map(({ label, Icon, href, tip }) => (
            <motion.a
              key={label} href={href}
              className="hero-social-btn"
              target="_blank" rel="noreferrer"
              title={tip}
              variants={fadeUp(0.85)}
              whileHover={{ y: -4, boxShadow: '0 6px 20px rgba(232,168,32,0.22)' }}
              whileTap={{ scale: 0.93 }}
            >
              <Icon size={15} />
              <span>{label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Right — photo card */}
      <div className="hero-right">
        <motion.div
          className="hero-photo-card"
          initial={{ opacity: 0, x: 50, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 900 }}
        >
          {/* Floating ring decoration */}
          <motion.div
            className="photo-ring photo-ring-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="photo-ring photo-ring-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />

          {/* Actual photo */}
          <motion.div
            className="photo-frame"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <img src="/ketan.jpg" alt="Ketan Bisht" className="photo-img" />
            {/* Name overlay */}
            <div className="photo-name-overlay">
              <span className="photo-name-text">Ketan Bisht</span>
              <span className="photo-name-role">Full Stack &amp; Blockchain</span>
            </div>
          </motion.div>

          {/* Floating stat chips */}
          <motion.div
            className="photo-chip photo-chip-1"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 400, damping: 22 }}
            whileHover={{ scale: 1.08 }}
          >
            <span className="chip-num">8</span>
            <span className="chip-lbl">Projects</span>
          </motion.div>
          <motion.div
            className="photo-chip photo-chip-2"
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.05, type: 'spring', stiffness: 400, damping: 22 }}
            whileHover={{ scale: 1.08 }}
          >
            <span className="chip-num">1</span>
            <span className="chip-lbl">npm pkg</span>
          </motion.div>
          <motion.div
            className="photo-chip photo-chip-3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.18, type: 'spring', stiffness: 400, damping: 22 }}
            whileHover={{ scale: 1.08 }}
          >
            <span className="chip-num">Open</span>
            <span className="chip-lbl">to work</span>
          </motion.div>

          {/* Tech stack strip */}
          <div className="photo-stack-strip">
            {['React','Solana','Node.js','Rust','TS'].map((t, i) => (
              <motion.span
                key={t} className="photo-stack-chip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.07 }}
              >{t}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Projects (the star) ────────────────────────────────────────────────── */
function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const visible = PROJECTS.filter(p =>
    filter === 'all' || p.category === filter
  );

  return (
    <section id="projects" className="section projects-section" ref={ref}>
      <div className="section-inner">
        <motion.span className="sec-eyebrow" variants={fadeUp(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          My Work
        </motion.span>

        <div className="proj-head-row">
          <motion.h2 className="sec-big" style={{ marginBottom: 0 }} variants={fadeUp(0.06)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            projects.
          </motion.h2>
          <motion.div className="proj-head-meta" variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <p className="proj-head-desc">
              Real projects — built and shipped by me. Each one has a GitHub link so you can read the actual code.
            </p>
            <a href="https://github.com/ketanbisht" target="_blank" rel="noreferrer" className="proj-github-link">
              <GithubIcon size={14} /> View all on GitHub <ArrowUpRight size={13} />
            </a>
          </motion.div>
        </div>

        {/* Filter pills */}
        <motion.div className="proj-filter" variants={fadeUp(0.12)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`pf-pill ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Featured projects — large cards */}
        <div className="proj-featured-row">
          <AnimatePresence mode="popLayout">
            {visible.filter(p => p.featured).map((p, i) => (
              <motion.div
                key={p.id}
                className="proj-card-featured"
                style={{ '--proj-color': p.color }}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {/* Card top accent bar */}
                <div className="pfcard-accent" />

                <div className="pfcard-inner">
                  <div className="pfcard-left">
                    <div className="pfcard-icon-row">
                      <span className="pfcard-emoji">{p.icon}</span>
                      <span className="pfcard-category">{
                          p.category === 'saas' ? 'SaaS Product' :
                          p.category === 'blockchain' ? 'Blockchain' :
                          p.category === 'game' ? 'Game' :
                          p.category === 'library' ? 'OSS Library' :
                          p.category === 'cli' ? 'CLI Tool' : 'Tool'
                        }</span>
                    </div>
                    <div className="pfcard-name">{p.name}</div>
                    <div className="pfcard-tagline">{p.tagline}</div>
                    <p className="pfcard-desc">{p.desc}</p>

                    {/* Challenge / Solution */}
                    <div className="pfcard-cs">
                      <div className="pfcard-cs-block">
                        <div className="pfcard-cs-label">Challenge</div>
                        <p className="pfcard-cs-text">{p.challenge}</p>
                      </div>
                      <div className="pfcard-cs-block">
                        <div className="pfcard-cs-label solution">Solution</div>
                        <p className="pfcard-cs-text">{p.solution}</p>
                      </div>
                    </div>

                    <div className="pfcard-tech">
                      {p.tech.map(t => <span key={t} className="pfcard-chip">{t}</span>)}
                    </div>
                  </div>

                  <div className="pfcard-right">
                    <div className="pfcard-links">
                      {p.github && (
                        <motion.a href={p.github} className="pfcard-link-btn" target="_blank" rel="noreferrer" whileHover={{ y: -2 }}>
                          <GithubIcon size={15} /> View Code
                        </motion.a>
                      )}
                      {p.live && (
                        <motion.a href={p.live} className="pfcard-link-btn pfcard-link-live" target="_blank" rel="noreferrer" whileHover={{ y: -2 }}>
                          <ExternalLink size={14} /> Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Non-featured projects — compact cards */}
        {visible.filter(p => !p.featured).length > 0 && (
          <div className="proj-grid">
            <AnimatePresence mode="popLayout">
              {visible.filter(p => !p.featured).map((p, i) => (
                <motion.div
                  key={p.id}
                  className={`proj-card ${expanded === p.id ? 'expanded' : ''}`}
                  style={{ '--proj-color': p.color }}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <div className="proj-card-accent" />
                  <div className="proj-card-top">
                    <span className="proj-card-emoji">{p.icon}</span>
                    <span className="proj-card-cat-badge">{
                      p.category === 'saas' ? 'SaaS' :
                      p.category === 'blockchain' ? 'Blockchain' :
                      p.category === 'game' ? 'Game' :
                      p.category === 'library' ? 'OSS Library' :
                      p.category === 'cli' ? 'CLI Tool' : 'Tool'
                    }</span>
                  </div>
                  <div className="proj-card-name">{p.name}</div>
                  <div className="proj-card-tagline">{p.tagline}</div>
                  <p className="proj-card-desc">{p.desc}</p>

                  {/* Expandable detail */}
                  <AnimatePresence>
                    {expanded === p.id && (
                      <motion.div
                        className="proj-card-detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="proj-cs-label">Challenge</div>
                        <p className="proj-cs-text">{p.challenge}</p>
                        <div className="proj-cs-label solution">Solution</div>
                        <p className="proj-cs-text">{p.solution}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    className="proj-expand-btn"
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  >
                    {expanded === p.id ? 'Less detail ↑' : 'More detail ↓'}
                  </button>

                  <div className="proj-card-tech">
                    {p.tech.map(t => <span key={t} className="proj-tech-chip">{t}</span>)}
                  </div>

                  <div className="proj-card-footer">
                    {p.github && (
                      <motion.a href={p.github} className="proj-ic-btn" target="_blank" rel="noreferrer" whileHover={{ scale: 1.08 }} title="View Code on GitHub">
                        <GithubIcon size={13} />
                      </motion.a>
                    )}
                    {p.live && (
                      <motion.a href={p.live} className="proj-ic-btn" target="_blank" rel="noreferrer" whileHover={{ scale: 1.08 }} title="Live Demo">
                        <ExternalLink size={12} />
                      </motion.a>
                    )}
                    {p.npm && (
                      <motion.a href={p.npm} className="proj-ic-btn" target="_blank" rel="noreferrer" whileHover={{ scale: 1.08 }} title="npm / Chrome Store">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>PKG</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────────────────────── */
function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" className="section services-section" ref={ref}>
      <div className="section-inner">
        <motion.span className="sec-eyebrow" variants={fadeUp(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}>What I Can Build</motion.span>
        <div className="services-head-row">
          <motion.h2 className="sec-big" style={{ marginBottom: 0 }} variants={fadeUp(0.06)} initial="hidden" animate={inView ? 'show' : 'hidden'}>services.</motion.h2>
          <motion.p className="services-sub" variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            I work across the full product lifecycle — from idea and architecture to deployment. No hand-offs, no miscommunication.
          </motion.p>
        </div>

        <motion.div className="services-grid" variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                className={`service-card ${s.highlight ? 'service-card-featured' : ''}`}
                variants={fadeUp(0.08 * i)}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
              >
                <div className={`service-icon ${s.highlight ? 'service-icon-featured' : ''}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="service-card-title">{s.title}</div>
                <p className="service-card-desc">{s.desc}</p>
                <div className="service-tech-wrap">
                  {s.tech.map(t => <span key={t} className="service-tech-chip">{t}</span>)}
                </div>
                <motion.button
                  className="service-cta-btn"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ x: 4 }}
                >
                  Discuss your project <ChevronRight size={14} />
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Process */}
        <motion.div className="process-strip" variants={fadeUp(0.3)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {[
            { step: '01', label: 'You describe the project', icon: MessageSquare },
            { step: '02', label: 'I propose scope & timeline', icon: CheckCircle },
            { step: '03', label: 'I build it, you review daily', icon: Zap },
            { step: '04', label: 'Ship & iterate together', icon: Shield },
          ].map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="process-step">
                <div className="process-step-num">{p.step}</div>
                <Icon size={15} strokeWidth={1.75} className="process-step-icon" />
                <span className="process-step-label">{p.label}</span>
                {i < 3 && <div className="process-arrow">→</div>}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────── */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const tags = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Solana', 'Anchor', 'Rust', 'Docker', 'AWS', 'Figma', 'OpenAI'];

  return (
    <section id="about" className="section" ref={ref}>
      <div className="section-inner">
        <motion.div className="about-grid" variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <div>
            <motion.span className="sec-eyebrow" variants={fadeUp(0)}>Who I Am</motion.span>
            <motion.h2 className="sec-big" variants={fadeUp(0.06)}>about<br />me.</motion.h2>
            <motion.p className="about-bio" variants={fadeUp(0.1)}>
              I'm <strong>Ketan Bisht</strong>, a self-taught Full Stack & Blockchain developer based in India.
              I learned by building real things — SaaS apps, Solana programs, npm packages, and multiplayer games.
            </motion.p>
            <motion.p className="about-bio" variants={fadeUp(0.14)}>
              I don't have a client list yet, but I have 8 shipped projects that prove I can build real software.
              Every project I take on gets my full focus — because how I treat your project is how I build my reputation.
            </motion.p>
            <motion.p className="about-bio" variants={fadeUp(0.18)} style={{ marginBottom: '1.75rem' }}>
              I care about clean code, honest communication, and shipping things that actually work and look great.
            </motion.p>
            <motion.div variants={fadeUp(0.2)}>
              {tags.map(t => <span key={t} className="about-tag">{t}</span>)}
            </motion.div>
          </div>

          <div>
            <motion.div className="about-stats" variants={stagger}>
              <motion.div className="about-stat-block" variants={fadeUp(0.08)}>
                <div className="asb-main-num">8</div>
                <div className="asb-main-info">
                  <span className="asb-main-lbl">Projects shipped</span>
                  <span className="asb-main-desc">Real apps — deployed, working, and on GitHub</span>
                </div>
              </motion.div>
              {[
                { n: '5+',   lbl: 'Languages' },
                { n: '1',    lbl: 'npm package' },
                { n: '100%', lbl: 'Commitment' },
              ].map((s, i) => (
                <motion.div key={i} className="about-stat-block" variants={fadeUp(0.12 + i * 0.06)}>
                  <span className="asb-num">{s.n}</span>
                  <span className="asb-lbl">{s.lbl}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────────────────────────── */
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section skills-section" ref={ref}>
      <div className="section-inner">
        <motion.span className="sec-eyebrow" variants={fadeUp(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}>Expertise</motion.span>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'0.5rem' }}>
          <motion.h2 className="sec-big" style={{ marginBottom:0 }} variants={fadeUp(0.06)} initial="hidden" animate={inView ? 'show' : 'hidden'}>skills &<br />resume.</motion.h2>
          <motion.a
            href="#"
            className="download-cv-btn"
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            whileHover={{ y: -2 }}
            onClick={e => e.preventDefault()}
          >
            <Download size={14} />
            Download CV
          </motion.a>
        </div>

        <div className="skills-cols">
          <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <div className="skills-col-head">Technical Skills</div>
            {[...SKILLS_A, ...SKILLS_B].map((s, i) => (
              <motion.div key={i} className="skill-row" variants={fadeUp(0.06 * i)}>
                <div className="skill-top">
                  <span className="skill-name-txt">{s.name}</span>
                  <span className="skill-pct-txt">{s.pct}%</span>
                </div>
                <div className="skill-track">
                  <motion.div
                    className="skill-fill"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.pct}%` } : { width: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 + i * 0.06 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp(0.12)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <div className="skills-col-head">Experience</div>
            <div className="exp-list">
              {EXPERIENCE.map((e, i) => (
                <motion.div key={i} className="exp-item" variants={fadeUp(0.1 * i)}>
                  <div className="exp-period">{e.period}</div>
                  <div className="exp-role">{e.role}</div>
                  <div className="exp-company">{e.company}</div>
                  <div className="exp-desc">{e.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────── */
function ContactForm({ inView }) {
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const onSubmit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry from ${form.name}`);
    const body = encodeURIComponent(
`Hi Ketan,

Here are my project details:

Name:         ${form.name}
Email:        ${form.email}
Project Type: ${form.type || 'Not specified'}
Budget:       ${form.budget || 'Not specified'}

Project Description:
${form.message}

---
Sent via portfolio contact form`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=ketan.work30@gmail.com&su=${subject}&body=${body}`, '_blank');
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', type: '', budget: '', message: '' }); }, 6000);
  };

  return (
    <motion.form className="c-form" onSubmit={onSubmit} variants={fadeUp(0.14)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
      <div className="c-form-row">
        <div className="c-group">
          <label className="c-label">Your Name</label>
          <input className="c-input" placeholder="Alex Johnson" value={form.name} onChange={set('name')} required />
        </div>
        <div className="c-group">
          <label className="c-label">Email</label>
          <input type="email" className="c-input" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
        </div>
      </div>
      <div className="c-group">
        <label className="c-label">Project Type</label>
        <select className="c-input c-select" value={form.type} onChange={set('type')}>
          <option value="">What do you need built?</option>
          <option>Full Stack Web App / SaaS</option>
          <option>Blockchain / Smart Contract</option>
          <option>API / Backend System</option>
          <option>Frontend / UI only</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="c-group">
        <label className="c-label">Budget Range</label>
        <select className="c-input c-select" value={form.budget} onChange={set('budget')}>
          <option value="">Rough budget (helps me scope it)</option>
          <optgroup label="🇮🇳 INR (India)">
            <option>₹10,000 – ₹30,000</option>
            <option>₹30,000 – ₹1,00,000</option>
            <option>₹1,00,000 – ₹3,00,000</option>
            <option>₹3,00,000+</option>
          </optgroup>
          <optgroup label="🌐 USD (International)">
            <option>$200 – $500</option>
            <option>$500 – $1,500</option>
            <option>$1,500 – $5,000</option>
            <option>$5,000+</option>
          </optgroup>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="c-group">
        <label className="c-label">Describe your project</label>
        <textarea className="c-textarea" rows={5} placeholder="What do you want to build? What's the problem it solves? Any timeline in mind?" value={form.message} onChange={set('message')} required />
      </div>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" className="c-success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            ✓ Gmail opened! I'll reply within 24 hours.
          </motion.div>
        ) : (
          <motion.button key="sub" type="submit" className="c-submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Send size={14} /> Send Message
          </motion.button>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <div className="section-inner">
        <motion.span className="sec-eyebrow" variants={fadeUp(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}>Get In Touch</motion.span>
        <motion.h2 className="sec-big" variants={fadeUp(0.06)} initial="hidden" animate={inView ? 'show' : 'hidden'}>let's build<br />something.</motion.h2>

        <div className="contact-grid">
          <motion.div variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'show' : 'hidden'}>
            <p className="contact-desc">
              I'm actively looking for my first freelance projects. If you have something you want built — a web app, an API,
              a Solana program — let's talk. I'll give it everything I've got.
            </p>

            {/* First-client callout */}
            <div className="first-client-box">
              <div className="fcb-title">🎯 First client offer</div>
              <p className="fcb-desc">
                To build my portfolio of real client work, I'm offering my first 3 clients discounted rates
                in exchange for an honest review and testimonial once the work is done.
              </p>
              <div className="fcb-spots">
                <span className="spot taken" />
                <span className="spot taken" />
                <span className="spot open" />
                <span className="fcb-spots-txt">1 spot remaining</span>
              </div>
            </div>

            <div className="contact-links">
              {[
                { Icon: GithubIcon,   label: 'GitHub',    handle: '@ketanbisht',           href: 'https://github.com/ketanbisht' },
                { Icon: LinkedinIcon, label: 'LinkedIn',  handle: 'Ketan Bisht',           href: 'https://www.linkedin.com/in/ketan-bisht-4b782b25b/' },
                { Icon: XIcon,        label: 'X',         handle: '@theketanBisht',        href: 'https://x.com/theketanBisht' },
                { Icon: Mail,         label: 'Email',     handle: 'ketan.work30@gmail.com', href: 'mailto:ketan.work30@gmail.com' },
              ].map(({ Icon, label, handle, href }, i) => (
                <motion.a key={i} href={href} className="csoc-item" target="_blank" rel="noreferrer" whileHover={{ x: 5 }}>
                  <div className="csoc-ic"><Icon size={14}/></div>
                  <div className="csoc-info">
                    <span className="csoc-name">{label}</span>
                    <span className="csoc-handle">{handle}</span>
                  </div>
                  <ArrowUpRight size={13} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
          <ContactForm inView={inView} />
        </div>
      </div>
    </section>
  );
}


/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand">Ketan Bisht</span>
        <span className="footer-avail">
          <span className="footer-avail-dot" />
          Open to first clients
        </span>
      </div>
      <div className="footer-links">
        {['projects','services','contact'].map(s => (
          <button key={s} className="footer-link" onClick={() => scrollTo(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <span className="footer-copy">Built with React & Framer Motion · {new Date().getFullYear()}</span>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('kb-theme') || 'light');
  const [active, setActive] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kb-theme', theme);
  }, [theme]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.25 }
    );
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Navbar active={active} theme={theme} toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      <Hero />
      <Projects />
      <Services />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
