import * as React from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { createRoot } from "react-dom/client";
import SkillpathCourses from "./SkillpathCourses";
import "./skillpath.css";

const conceptCourses = [
  { title: "AI for Product Builders", meta: "Product · live", art: "blue" },
  { title: "System Design Fundamentals", meta: "Technology · live", art: "slate" },
  { title: "Finance for Founders", meta: "Business · live", art: "cobalt" },
];

const signalItems = [
  { index: "01", label: "Live catalogue", detail: "Course data, not mock cards." },
  { index: "02", label: "Adaptive path", detail: "Search, sort, and keep moving." },
  { index: "03", label: "Human-led", detail: "Learn from people who build." },
];

const heroHeadlineLine = {
  hidden: { opacity: 0, y: "105%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const } },
};

function LiveOrbit() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const orbitRotation = useSpring(useTransform(scrollYProgress, [0, 1], [0, 18]), { stiffness: 80, damping: 24 });
  const cardY = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, -18]), { stiffness: 90, damping: 24 });
  const cardScale = useSpring(useTransform(scrollYProgress, [0, 0.42], [1, 0.93]), { stiffness: 90, damping: 25 });
  const cardOpacity = useTransform(scrollYProgress, [0, 0.34], [1, 0.88]);
  const cardRotateZ = useTransform(scrollYProgress, [0, 0.42], [3.4, 1.8]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cardX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 120, damping: 24 });
  const cardRotateX = useSpring(useTransform(pointerY, [-1, 1], [2.5, -2.5]), { stiffness: 120, damping: 24 });
  const cardRotateY = useSpring(useTransform(pointerX, [-1, 1], [-2.5, 2.5]), { stiffness: 120, damping: 24 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2));
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2));
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div className="preview-orbit-stage" aria-hidden="true" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className="preview-grid-lines" />
      <div className="preview-hero-blue-sphere" />
      <div className="preview-hero-haze" />
      <motion.div className="preview-orbit preview-orbit-one" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.div className="preview-orbit preview-orbit-two" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.div className="preview-orbit preview-orbit-three" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.div className="preview-orbit preview-orbit-four" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.span className="preview-orbit-dot preview-orbit-dot-one" animate={reducedMotion ? undefined : { scale: [1, 1.28, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.span className="preview-orbit-dot preview-orbit-dot-two" animate={reducedMotion ? undefined : { scale: [1, 0.72, 1], opacity: [0.65, 1, 0.65] }} transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
      <motion.span className="preview-orbit-dot preview-orbit-dot-three" animate={reducedMotion ? undefined : { y: [0, -8, 0], opacity: [0.45, 1, 0.45] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} />
      <motion.div className="preview-hero-orbit-card" style={reducedMotion ? { rotateZ: 3.4 } : { x: cardX, y: cardY, scale: cardScale, opacity: cardOpacity, rotateX: cardRotateX, rotateY: cardRotateY, rotateZ: cardRotateZ }}>
        <div className="preview-dashboard-topbar">
          <div className="preview-dashboard-brand"><span className="preview-brand-mark" /> <strong>Catalogue</strong></div>
          <span className="preview-dashboard-ghost-line" />
          <span className="preview-dashboard-top-status"><span className="skillpath-signal-dot skillpath-signal-dot-mint" /> Live index</span>
        </div>
        <div className="preview-dashboard-window">
          <aside className="preview-orbit-sidebar">
            <span className="preview-sidebar-active">All courses <b>842</b></span>
            <span>Live now <b>24</b></span>
            <span>Upcoming <b>37</b></span>
            <span>New this week <b>18</b></span>
            <i />
            <span>Design</span><span>Technology</span><span>Business</span><span>Product</span>
          </aside>
          <div className="preview-orbit-results">
            <div className="preview-dashboard-search"><b>⌕ &nbsp; Search courses, skills or topics</b><span>☷</span></div>
            <div className="preview-dashboard-heading"><strong>Live now <em><span className="skillpath-signal-dot skillpath-signal-dot-mint" /> live</em></strong><span>View all →</span></div>
            <div className="preview-orbit-cards">
              {conceptCourses.map(({ title, meta, art }) => (
                <motion.div className="preview-orbit-course" key={title} whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ duration: 0.2 }}>
                  <div className={`preview-orbit-course-art preview-orbit-course-art-${art}`} />
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </motion.div>
              ))}
            </div>
            <div className="preview-dashboard-heading preview-dashboard-heading-new"><strong>New this week</strong><span>Browse →</span></div>
            <div className="preview-dashboard-mini-row"><span /><span /><span /></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LiveSignalBand({ reducedMotion }: { reducedMotion: boolean | null }) {
  const tickerItems = [
    { label: "LIVE API", detail: "requested now" },
    { label: "REGIONAL PRICING", detail: "display-boundary safe" },
    { label: "SEARCHABLE", detail: "course-level discovery" },
    { label: "FRAMER-READY", detail: "portable component" },
    { label: "MOTION WITH PURPOSE", detail: "reduced-motion aware" },
    { label: "LIVE API", detail: "requested now" },
    { label: "REGIONAL PRICING", detail: "display-boundary safe" },
  ];
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragLimit, setDragLimit] = React.useState(0);

  React.useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setDragLimit(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="preview-proof" aria-label="Skillpath product principles">
      <div className="preview-proof-intro">
        <span className="skillpath-signal-dot skillpath-signal-dot-mint" aria-hidden="true" />
        <div><strong>System pulse</strong><span>Built to stay clear at the edges.</span></div>
      </div>
      <div className="preview-proof-items">
        {signalItems.map((item) => (
          <div className="preview-proof-item" key={item.index}>
            <span className="preview-proof-index">{item.index}</span>
            <div><strong>{item.label}</strong><span>{item.detail}</span></div>
          </div>
        ))}
      </div>
      <div className="preview-proof-marquee" ref={viewportRef} aria-hidden="true">
        <motion.div
          ref={trackRef}
          className="preview-proof-marquee-track"
          drag={dragLimit > 0 ? "x" : false}
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragDirectionLock
          dragElastic={0.08}
          whileTap={reducedMotion ? undefined : { cursor: "grabbing" }}
        >
          {tickerItems.map((item, index) => (
            <span key={`${item.label}-${index}`}>
              <b>{item.label}</b>
              <em>{item.detail}</em>
              <i />
            </span>
          ))}
        </motion.div>
        <span className="preview-proof-ticker-hint">drag / swipe <b aria-hidden="true">↔</b></span>
      </div>
    </section>
  );
}

function Preview() {
  const reducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [navElevated, setNavElevated] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 22;
    setNavElevated((current) => current === next ? current : next);
  });

  return (
    <main className="preview-page">
      <motion.div className="preview-scroll-progress" style={{ scaleX: scrollProgress }} aria-hidden="true" />
      <motion.nav className={`preview-nav${navElevated ? " preview-nav-scrolled" : ""}`} aria-label="Primary navigation" initial={reducedMotion ? undefined : { opacity: 0, y: -10 }} animate={reducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <a className="preview-brand" href="#top" aria-label="Skillpath home"><span className="preview-brand-mark" aria-hidden="true" />skillpath</a>
        <div className="preview-nav-links"><a className="preview-nav-link-active" href="#courses">Explore</a><a href="#about">Membership</a><a href="#about">For teams</a><a href="#about">Enterprise</a><a href="#about">Blog</a><a href="#about">About</a><span className="preview-nav-status"><span className="skillpath-signal-dot skillpath-signal-dot-mint" /> System live</span><a className="preview-nav-login" href="#about">Log in</a><a className="preview-nav-cta" href="#courses">Start free <span aria-hidden="true">↗</span></a></div>
      </motion.nav>

      <section id="top" className="preview-hero">
        <LiveOrbit />
        <motion.div className="preview-hero-copy" initial={reducedMotion ? undefined : "hidden"} animate={reducedMotion ? undefined : "visible"} variants={{ hidden: {}, visible: { transition: { delayChildren: 0.15, staggerChildren: 0.09 } } }}>
          <motion.p className="preview-hero-eyebrow" variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } } }}><span className="skillpath-signal-dot" /> India&apos;s learning membership</motion.p>
          <motion.h1 aria-label="Learn. Apply. Advance." variants={{ hidden: {}, visible: { transition: { delayChildren: 0.05, staggerChildren: 0.1 } } }}>
            <span className="preview-hero-line-clip"><motion.span className="preview-hero-line" variants={heroHeadlineLine}>LEARN.</motion.span></span>
            <span className="preview-hero-line-clip"><motion.span className="preview-hero-line" variants={heroHeadlineLine}>APPLY.</motion.span></span>
            <span className="preview-hero-line-clip"><motion.span className="preview-hero-line preview-hero-line-accent" variants={heroHeadlineLine}>ADVANCE.</motion.span></span>
          </motion.h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}>Unlimited access to live courses, expert mentorship and a path that adapts to you. All in one membership.</motion.p>
          <motion.div className="preview-hero-actions" variants={{ hidden: { opacity: 0, y: 13 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}>
            <a className="skillpath-button preview-hero-button" href="#courses">Start free <span aria-hidden="true">↗</span></a>
            <a className="preview-hero-secondary" href="#courses">Explore courses <span aria-hidden="true">→</span></a>
          </motion.div>
          <motion.div className="preview-hero-signal" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }}><span className="skillpath-signal-dot skillpath-signal-dot-mint" /><span className="preview-hero-signal-copy"><strong>Live catalogue</strong><span>Course data, not mock cards.</span></span><span className="preview-signal-wave" aria-hidden="true" /></motion.div>
        </motion.div>
        <div className="preview-api-label"><div><strong>Catalogue API</strong><span>GET · resilient by design</span></div></div>
      </section>

      <LiveSignalBand reducedMotion={reducedMotion} />
      <div id="courses" className="preview-courses-wrap"><SkillpathCourses /></div>
      <footer id="about" className="preview-footer"><a className="preview-brand" href="#top"><span className="preview-brand-mark" aria-hidden="true" />skillpath</a><div className="preview-footer-links"><a href="#about">About</a><a href="#courses">Courses</a><a href="https://only-collection-516444.framer.app/" target="_blank" rel="noreferrer">Published Framer canvas</a><a href="https://github.com/AyushCoder9/skillpath-framer-assessment" target="_blank" rel="noreferrer">GitHub</a></div><small>© 2026 Skillpath. Keep learning.</small></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Preview />);
