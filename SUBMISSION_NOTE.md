# Submission note (under 200 words)

Skillpath treats the course catalogue as a live product surface rather than a static card grid. The two endpoints are fetched independently: if course data succeeds while regional pricing fails, the catalogue stays usable and each card says “Price unavailable” instead of guessing a currency. Prices are converted at the display boundary from paise or USD cents, and the active region is shown beside the value.

With two more days, I would add a small request-observability panel for development-only builds and test a larger matrix of slow responses, malformed payloads, empty arrays, repeated retries, and intermediate viewport widths. I would consider cached regional pricing only after confirming whether stale prices are acceptable; I would not silently persist them by default.

The visual layer uses React/CSS and Framer Motion primitives only: motion components, AnimatePresence, layout transitions, scroll/spring transforms, and reduced-motion support. No GSAP, Lottie, Three.js, external UI kit, or copied template is used. I used AI to draft an initial fetch/component structure, then reviewed and rewrote the response validation, independent error handling, currency conversion, cancellation, accessibility states, responsive layout, and motion behavior. I can explain every line in the submitted component.
