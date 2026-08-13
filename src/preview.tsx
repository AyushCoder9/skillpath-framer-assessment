import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { createRoot } from "react-dom/client";
import SkillpathCourses from "./SkillpathCourses";
import "./skillpath.css";

function LiveOrbit() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const orbitRotation = useSpring(useTransform(scrollYProgress, [0, 1], [0, 18]), { stiffness: 80, damping: 24 });
  const cardY = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, -18]), { stiffness: 90, damping: 24 });

  return (
    <>
      <motion.div className="preview-orbit preview-orbit-one" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.div className="preview-orbit preview-orbit-two" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.div className="preview-orbit preview-orbit-three" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
      <motion.span className="preview-orbit-dot preview-orbit-dot-one" animate={reducedMotion ? undefined : { scale: [1, 1.28, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.span className="preview-orbit-dot preview-orbit-dot-two" animate={reducedMotion ? undefined : { scale: [1, 0.72, 1], opacity: [0.65, 1, 0.65] }} transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
      <motion.div className="preview-hero-orbit-card" style={reducedMotion ? undefined : { y: cardY }}>
        <div className="preview-orbit-card-top"><strong>skillpath / live index</strong><span className="preview-orbit-card-status"><span className="skillpath-signal-dot skillpath-signal-dot-mint" /> API connected</span></div>
        <div className="preview-orbit-card-body">
          <div className="preview-orbit-sidebar"><span>All courses</span><span>Live now</span><span>New this week</span><span>Design</span><span>Technology</span><span>Business</span></div>
          <div className="preview-orbit-results">
            <div className="preview-orbit-search"><b>⌕ &nbsp; Search the catalogue</b><span>Sort ↕</span></div>
            <div className="preview-orbit-cards">
              {[['AI for builders', 'Product'], ['Systems that scale', 'Technology'], ['Make better work', 'Business']].map(([title, category]) => (
                <motion.div className="preview-orbit-course" key={title} whileHover={reducedMotion ? undefined : { y: -3 }} transition={{ duration: 0.2 }}>
                  <div className="preview-orbit-course-art" /><strong>{title}</strong><small>{category} · live</small>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Preview() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="preview-page">
      <motion.nav className="preview-nav" initial={reducedMotion ? undefined : { opacity: 0, y: -10 }} animate={reducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <a className="preview-brand" href="#top" aria-label="Skillpath home"><span className="preview-brand-mark" aria-hidden="true" />skillpath<span>.</span></a>
        <div className="preview-nav-links"><a href="#courses">Explore</a><a href="#about">Membership</a><a href="#about">For teams</a><span className="preview-nav-status"><span className="skillpath-signal-dot skillpath-signal-dot-mint" /> System live</span><a className="preview-nav-cta" href="#courses">Explore courses <span aria-hidden="true">↗</span></a></div>
      </motion.nav>

      <section id="top" className="preview-hero">
        <LiveOrbit />
        <motion.div className="preview-hero-copy" initial={reducedMotion ? undefined : "hidden"} animate={reducedMotion ? undefined : "visible"} variants={{ hidden: {}, visible: { transition: { delayChildren: 0.15, staggerChildren: 0.09 } } }}>
          <motion.p className="preview-hero-eyebrow" variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } } }}><span className="skillpath-signal-dot" /> India&apos;s learning membership</motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } } }}>Learn.<br />Apply.<br /><span>Advance.</span></motion.h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}>Focused courses, useful systems, and a catalogue that updates with the work you want to do next.</motion.p>
          <motion.a className="skillpath-button preview-hero-button" href="#courses" variants={{ hidden: { opacity: 0, y: 13 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}>Explore live catalogue <span aria-hidden="true">↗</span></motion.a>
          <motion.div className="preview-hero-signal" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }}><span className="skillpath-signal-dot skillpath-signal-dot-mint" /><span className="preview-hero-signal-copy"><strong>Live catalogue</strong><span>Course data, not mock cards.</span></span><span className="preview-signal-wave" aria-hidden="true" /></motion.div>
        </motion.div>
        <div className="preview-api-label"><div><strong>Catalogue API</strong><span>GET · resilient by design</span></div></div>
      </section>

      <motion.section className="preview-proof" initial={reducedMotion ? undefined : "hidden"} whileInView={reducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.35 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} aria-label="Product principles">
        {[['No mock cards', 'Every course is fetched live'], ['Currency aware', 'Paise and cents stay honest'], ['Failure visible', 'The page never goes blank']].map(([title, detail]) => (
          <motion.div className="preview-proof-item" key={title} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}><span className="skillpath-signal-dot skillpath-signal-dot-mint" /><div><strong>{title}</strong><span>{detail}</span></div></motion.div>
        ))}
      </motion.section>

      <div id="courses" className="preview-courses-wrap"><SkillpathCourses /></div>
      <footer id="about" className="preview-footer"><a className="preview-brand" href="#top"><span className="preview-brand-mark" aria-hidden="true" />skillpath<span>.</span></a><div className="preview-footer-links"><a href="#about">About</a><a href="#courses">Courses</a><a href="mailto:hello@skillpath.example">Contact</a></div><small>© 2026 Skillpath. Keep learning.</small></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Preview />);
