# Submission note (under 200 words)

Published Framer canvas: https://only-collection-516444.framer.app/
Production preview: https://skillpath-framer-assessment.vercel.app/
Code: https://github.com/AyushCoder9/skillpath-framer-assessment

Skillpath treats the course catalogue as a live product surface rather than a static card grid. Course data and regional pricing are fetched independently: if pricing fails, the catalogue stays usable and each card says “Price unavailable” instead of guessing a currency. Prices are converted only at the display boundary from paise or USD cents, with the active region shown beside the value.

The final interface is deliberately calm: the hero catalogue clears the sticky navigation, the signal rail is bounded and draggable, and course-card hover adds a crisp local lift without blurring or dimming neighboring content. The visual layer uses React/CSS and Framer Motion primitives with responsive and reduced-motion paths. No GSAP, Lottie, Three.js, external UI kit, database, or copied template is used.

I used AI to draft an initial fetch/component structure, then reviewed and rewrote response validation, independent error handling, currency conversion, cancellation, accessibility states, responsive layout, and motion behavior. The repository includes the complete free-component marketplace audit and a reproducible production build.
