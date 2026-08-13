import * as React from "react";
import { createRoot } from "react-dom/client";
import SkillpathCourses from "./SkillpathCourses";
import "./skillpath.css";

function Preview() {
  return (
    <main className="preview-page">
      <nav className="preview-nav">
        <strong>skillpath<span>.</span></strong>
        <div><a href="#courses">Courses</a><a href="#about">About</a><a className="preview-nav-button" href="#courses">Explore learning</a></div>
      </nav>
      <section className="preview-hero">
        <div className="preview-orbit preview-orbit-one" />
        <div className="preview-orbit preview-orbit-two" />
        <p className="skillpath-eyebrow">A BETTER WAY TO KEEP GOING</p>
        <h1>Learn the things that move your life forward.</h1>
        <p>Focused courses, useful systems, and a community for ambitious people building their next chapter.</p>
        <a className="skillpath-button preview-hero-button" href="#courses">Find your next course <span>↗</span></a>
      </section>
      <div id="courses" className="preview-courses-wrap"><SkillpathCourses /></div>
      <footer id="about" className="preview-footer"><strong>skillpath<span>.</span></strong><div><a href="#about">About</a><a href="#courses">Courses</a><a href="mailto:hello@skillpath.example">Contact</a></div><small>© 2026 Skillpath. Keep learning.</small></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Preview />);
