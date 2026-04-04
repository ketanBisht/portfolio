import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Mail, ArrowRight, Code2, Send, Palette } from 'lucide-react';
import './App.css';

// ─── Brand Icon SVGs ──────────────────────────────────────────────────────────
const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
  }
});
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  {
    icon: '⚡',
    iconBg: 'rgba(200,245,66,0.08)',
    name: 'Frontend',
    desc: 'Crafting pixel-perfect, performant interfaces users love.',
    tags: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind'],
  },
  {
    icon: '🛠️',
    iconBg: 'rgba(100,100,255,0.08)',
    name: 'Backend',
    desc: 'Robust APIs, scalable architectures, realtime systems.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'REST / GraphQL'],
  },
  {
    icon: '🔗',
    iconBg: 'rgba(255,150,50,0.08)',
    name: 'Blockchain',
    desc: 'Smart contracts, dApps and Web3 integrations on Solana & EVM.',
    tags: ['Solana', 'Anchor', 'Ethers.js', 'Rust', 'Solidity'],
  },
  {
    icon: '🎨',
    iconBg: 'rgba(255,80,120,0.08)',
    name: 'Design',
    desc: 'Systems thinking meets aesthetics — from wireframe to launch.',
    tags: ['Figma', 'Motion Design', 'Design Systems', 'CSS', 'SVG'],
  },
  {
    icon: '☁️',
    iconBg: 'rgba(50,180,255,0.08)',
    name: 'DevOps / Cloud',
    desc: 'CI/CD pipelines, containerized deploys, cloud infrastructure.',
    tags: ['Docker', 'AWS', 'GitHub Actions', 'Vercel', 'Nginx'],
  },
  {
    icon: '🤖',
    iconBg: 'rgba(200,150,255,0.08)',
    name: 'AI / LLMs',
    desc: 'Integrating large language models into production products.',
    tags: ['OpenAI', 'LangChain', 'RAG', 'Embeddings', 'Python'],
  },
];

const PROJECTS = [
  {
    name: 'Fitshit',
    desc: 'A full-stack SaaS platform for gym management — member onboarding, plan management, analytics dashboard with revenue tracking, and admin controls. Built with React, Node.js, and PostgreSQL.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    github: '#',
    live: '#',
    featured: true,
  },
  {
    name: 'SkillsOnChain',
    desc: 'Decentralized credential verification system on Solana. Issues, revokes, and verifies professional certificates as on-chain verifiable credentials. Smart contracts written in Rust / Anchor.',
    tech: ['Solana', 'Anchor', 'Rust', 'Next.js', 'Phantom'],
    github: '#',
    live: '#',
    featured: true,
  },
  {
    name: 'In-Memory Solana RPC',
    desc: 'A single-node in-memory Solana-compatible JSON-RPC server that accepts real Solana transactions against an in-memory ledger. Supports System Program, SPL Token, and ATA Program.',
    tech: ['Node.js', 'Solana', 'TypeScript', 'JSON-RPC'],
    github: '#',
    featured: false,
  },
  {
    name: 'Developer Portfolio',
    desc: 'This very portfolio — minimalist, dark, Framer Motion first. Designed from scratch with custom CSS variables, fluid typography and micro-interactions throughout.',
    tech: ['React', 'Framer Motion', 'Vite', 'Vanilla CSS'],
    github: '#',
    live: '#',
    featured: false,
  },
];

const EXPERIENCE = [
  {
    period: '2025 – Present',
    role: 'Senior Full Stack Engineer',
    company: 'Freelance',
    desc: 'Building bespoke SaaS products for clients globally — from zero to deployed. Focus on React, Node.js and Solana blockchain integrations, shipping production-grade applications with exceptional UX.',
  },
  {
    period: '2023 – 2025',
    role: 'Full Stack Developer',
    company: 'Previous Company',
    desc: 'Led frontend architecture for a B2B product used by 10k+ users. Introduced TypeScript, design systems and automated CI/CD pipelines that reduced deployment time by 60%.',
  },
  {
    period: '2022 – 2023',
    role: 'Frontend Developer',
    company: 'Agency',
    desc: 'Delivered performant, accessible React applications for enterprise clients. Collaborated closely with designers to implement pixel-precise interfaces with smooth animations.',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
function Nav({ scrolled }) {
  return (
    <motion.nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-logo">
        KB<span>.</span>
      </div>
      <ul className="nav-links">
        {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`}>{item}</a>
          </li>
        ))}
      </ul>
      <motion.a
        href="#contact"
        className="nav-cta"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        Let's talk
      </motion.a>
    </motion.nav>
  );
}

function Hero() {
  const lines = [
    { text: 'Ketan', em: false },
    { text: 'Bisht', em: false },
    { text: ['crafts', ' digital', ' things.'], em: [false, true, false] },
  ];

  return (
    <section className="hero" id="home">
      <div className="hero-bg-grid" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="hero-inner">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="hero-badge-dot" />
          <span className="mono">Available for projects</span>
        </motion.div>

        <h1 className="hero-title">
          {[
            { content: 'Ketan', delay: 0.5 },
            { content: 'Bisht', delay: 0.65 },
            {
              content: (
                <>crafts <em>digital</em> things.</>
              ),
              delay: 0.8,
            },
          ].map((line, i) => (
            <motion.span
              key={i}
              className="hero-title-line"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line.delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {line.content}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          Full Stack Developer & Blockchain Engineer based in India.
          I build products that are fast, beautiful and work.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7 }}
        >
          <motion.a
            href="#projects"
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View work <ArrowRight size={16} />
          </motion.a>
          <motion.a
            href="#contact"
            className="btn-ghost"
            whileHover={{ x: 4 }}
          >
            Get in touch
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="hero-scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref}>
      <div className="section-inner">
        <motion.span
          className="section-label"
          variants={stagger(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          // about_me
        </motion.span>

        <div className="about-grid">
          <div>
            <motion.h2
              className="section-title"
              variants={stagger(0.1)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              Developer.<br />Builder.<br />Problem solver.
            </motion.h2>
            <motion.p
              className="section-desc"
              variants={stagger(0.2)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              I'm Ketan — a full stack developer and blockchain engineer who loves working at the intersection of great engineering and thoughtful design.
              I've shipped products from idea to production, written smart contracts on Solana, and built SaaS platforms with real users.
            </motion.p>
            <motion.p
              className="section-desc"
              style={{ marginTop: '1rem' }}
              variants={stagger(0.3)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              When I'm not writing code, I'm exploring new tech, contributing to open-source or diving deep into system design.
            </motion.p>

            <motion.div
              className="about-stats"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {[
                { n: '3+', label: 'Years experience' },
                { n: '20+', label: 'Projects shipped' },
                { n: '10k+', label: 'Users impacted' },
                { n: '5+', label: 'Happy clients' },
              ].map((s, i) => (
                <motion.div key={i} className="stat-card" variants={stagger(0.1 * i)}>
                  <div className="stat-number">{s.n}</div>
                  <div className="stat-label">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="about-image"
            variants={stagger(0.4)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <div className="about-avatar">
              <div className="avatar-inner">
                <span className="avatar-initials">KB</span>
              </div>
            </div>
            <motion.div
              className="about-badge"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Code2 size={14} /> Full Stack
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="skills-section" ref={ref}>
      <div className="section-inner">
        <motion.span
          className="section-label"
          variants={stagger(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          // what_i_do
        </motion.span>
        <motion.h2
          className="section-title"
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          Skills & expertise
        </motion.h2>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {SKILLS.map((skill, i) => (
            <motion.div
              key={i}
              className="skill-card"
              variants={stagger(0.08 * i)}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="skill-icon" style={{ background: skill.iconBg }}>
                {skill.icon}
              </div>
              <div className="skill-name">{skill.name}</div>
              <p className="skill-desc">{skill.desc}</p>
              <div className="skill-tags">
                {skill.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--y', `${y}%`);
  };

  return (
    <section id="projects" className="projects-section" ref={ref}>
      <div className="section-inner">
        <div className="projects-header">
          <div>
            <motion.span
              className="section-label"
              variants={stagger(0)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              // selected_work
            </motion.span>
            <motion.h2
              className="section-title"
              variants={stagger(0.1)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              Projects
            </motion.h2>
          </div>
          <motion.a
            href="https://github.com/ketanbisht"
            className="btn-ghost"
            target="_blank"
            rel="noreferrer"
            variants={stagger(0.2)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            whileHover={{ x: 4 }}
          >
            GitHub <ArrowRight size={14} />
          </motion.a>
        </div>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              className="project-card"
              variants={stagger(0.1 * i)}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            >
              <div>
                {p.featured && (
                  <div className="project-featured">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                    Featured
                  </div>
                )}
                <div className="project-number mono">0{i + 1}</div>
                <div className="project-name">{p.name}</div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-links">
                {p.github && (
                  <motion.a
                    href={p.github}
                    className="project-link"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GithubIcon size={16} />
                  </motion.a>
                )}
                {p.live && (
                  <motion.a
                    href={p.live}
                    className="project-link"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <div className="section-inner">
        <motion.span
          className="section-label"
          variants={stagger(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          // career_path
        </motion.span>
        <motion.h2
          className="section-title"
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          Experience
        </motion.h2>

        <motion.div
          className="timeline"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {EXPERIENCE.map((exp, i) => (
            <motion.div key={i} className="timeline-item" variants={stagger(0.15 * i)}>
              <div className="timeline-dot">
                <div className="timeline-dot-inner" />
              </div>
              <div className="timeline-content">
                <div className="timeline-period">{exp.period}</div>
                <div className="timeline-role">{exp.role}</div>
                <div className="timeline-company">{exp.company}</div>
                <p className="timeline-desc">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const links = [
    { icon: <GithubIcon size={16} />, label: 'GitHub', handle: '@ketanbisht', href: 'https://github.com/ketanbisht' },
    { icon: <LinkedinIcon size={16} />, label: 'LinkedIn', handle: 'Ketan Bisht', href: '#' },
    { icon: <TwitterIcon size={16} />, label: 'Twitter / X', handle: '@ketanbisht', href: '#' },
    { icon: <Mail size={16} />, label: 'Email', handle: 'ketan@example.com', href: 'mailto:ketan@example.com' },
  ];

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className="section-inner">
        <motion.span
          className="section-label"
          variants={stagger(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          // get_in_touch
        </motion.span>
        <motion.h2
          className="section-title"
          variants={stagger(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          Let's build<br />something great.
        </motion.h2>
        <motion.p
          className="section-desc"
          variants={stagger(0.2)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          Open to freelance projects, collaborations and interesting conversations. Drop a message or reach out on socials.
        </motion.p>

        <div className="contact-inner">
          <motion.div
            variants={stagger(0.3)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <div className="contact-links">
              {links.map((l, i) => (
                <motion.a
                  key={i}
                  href={l.href}
                  className="contact-link-item"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                >
                  <div className="contact-link-icon">{l.icon}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{l.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l.handle}</div>
                  </div>
                  <ArrowRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            variants={stagger(0.4)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            <div className="form-group">
              <label className="form-label">name</label>
              <input className="form-input" placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label className="form-label">email</label>
              <input type="email" className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">message</label>
              <textarea className="form-textarea" rows={5} placeholder="Tell me about your project..." required />
            </div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    padding: '1rem 2rem',
                    background: 'rgba(200,245,66,0.1)',
                    border: '1px solid var(--accent)',
                    borderRadius: 12,
                    color: 'var(--accent)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  ✓ Message sent! I'll be in touch.
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  className="form-submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Send size={15} /> Send message
                </motion.button>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <motion.footer
      className="footer container"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <span className="footer-name">Ketan Bisht</span>
        {' '}— Designed & built with React & Framer Motion
      </div>
      <div className="mono" style={{ fontSize: '0.75rem' }}>
        {new Date().getFullYear()} · All rights reserved
      </div>
    </motion.footer>
  );
}

// ─── Cursor Follow ────────────────────────────────────────────────────────────
function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      if (e.target.closest('a, button')) setHovered(true);
      else setHovered(false);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  const size = hovered ? 40 : 10;
  const offset = hovered ? 20 : 5;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          width: size,
          height: size,
          borderRadius: '50%',
          background: hovered ? 'transparent' : 'var(--accent)',
          border: hovered ? '1px solid var(--accent)' : 'none',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: 'difference',
          top: 0,
          left: 0,
        }}
        animate={{ x: pos.x - offset, y: pos.y - offset }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <motion.div
        style={{
          position: 'fixed',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 10001,
          top: 0,
          left: 0,
        }}
        animate={{ x: pos.x - 2, y: pos.y - 2 }}
        transition={{ type: 'spring', stiffness: 800, damping: 40 }}
      />
    </>
  );
}

// ─── Theme Switcher ───────────────────────────────────────────────────────────
const THEMES = [
  { id: 'dark',     label: 'Dark',     dot: '#c8f542', bg: '#080808' },
  { id: 'light',    label: 'Light',    dot: '#7ab800', bg: '#f5f4ef' },
  { id: 'midnight', label: 'Midnight', dot: '#a78bfa', bg: '#07071a' },
  { id: 'aurora',   label: 'Aurora',   dot: '#00e5a0', bg: '#04100d' },
];

function ThemeSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-switcher">
      <AnimatePresence>
        {open && (
          <motion.div
            className="theme-options"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {THEMES.map((t, i) => (
              <motion.button
                key={t.id}
                className={`theme-option ${current === t.id ? 'active' : ''}`}
                onClick={() => { onChange(t.id); setOpen(false); }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.96 }}
              >
                <span
                  className="theme-dot"
                  style={{
                    background: t.dot,
                    boxShadow: current === t.id ? `0 0 8px ${t.dot}` : 'none',
                  }}
                />
                {t.label}
                {current === t.id && (
                  <motion.span
                    layoutId="active-check"
                    style={{ marginLeft: 2, color: 'var(--accent)', fontSize: '0.65rem' }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="theme-trigger"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Switch theme"
      >
        <Palette size={17} />
      </motion.button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('kb-theme') || 'dark'
  );

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kb-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Cursor />
      <Nav scrolled={scrolled} />
      <ThemeSwitcher current={theme} onChange={setTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
