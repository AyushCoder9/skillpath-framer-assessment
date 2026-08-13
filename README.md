# Skillpath — WebVeda technical assessment

Skillpath is a Framer Code Component and standalone preview for WebVeda's junior developer assignment. The page is intentionally designed as a **live catalogue instrument**, not a static course landing page: the interface makes the API, currency boundary, and failure behavior visible without exposing implementation noise to learners.

## MVP thesis: make reliability feel like product design

Most submissions will show a clean grid after a successful request. Skillpath differentiates itself by making the hard parts legible and beautiful:

- the catalogue is visibly live and reports its current sync/online/reconnecting state;
- the two endpoints are fetched independently, so course cards remain usable when regional pricing fails;
- prices are converted from paise/cents only at the display boundary and the active region is shown beside the price;
- loading, empty, no-match, API-error, and partial-country-error states are designed states rather than blank screens;
- the catalogue is searchable, locally sortable, responsive, keyboard navigable, and animated without hiding the data;
- the hero previews the actual catalogue behavior with an orbital “live index” visual, while the course section remains the source of truth.

No new backend or database is added deliberately. The assessment supplies the only required GET APIs, and introducing a proxy/database would create a second source of truth and distract from the frontend/data-handling test.

## Framer-only motion constraint

The visual layer uses only React DOM/CSS plus Framer's own motion primitives:

- `motion` for entrance, hover, tap, and layout transitions;
- `AnimatePresence` for state and price transitions;
- `MotionConfig reducedMotion="user"` and `useReducedMotion` for accessibility;
- `useScroll`, `useSpring`, and `useTransform` for the hero's orbit/parallax behavior.

There is no GSAP, Lottie, Three.js, external component library, custom animation engine, or imported template. The component keeps exactly two Framer property controls: accent color and refundable-badge visibility.

## What is implemented

- Live `GET` requests to `/assignment/course-data` and `/assignment/country-code`.
- Strict response-shape validation for courses and country codes.
- Independent course/country failure handling.
- Correct paise → rupee and USD cents → dollar conversion.
- Regional price status on each card; no guessed currency when the country call fails.
- Loading skeletons with motion, retryable API error state, zero-result state, and no-match state.
- Search across course name, description, category, short course, and type.
- Featured, low-to-high, and high-to-low sorting in the active currency.
- Responsive 3/2/1 course grid for desktop/tablet/mobile.
- Framer Motion card reveal, layout transitions, hover lift, press feedback, live status, price transitions, orbit animation, and reduced-motion support.
- Accessible labels, `status`/`alert` roles, focus rings, `AbortController` cancellation, and GET-only requests.

## Local preview

```bash
npm install
npm run dev
```

The Vite preview aliases Framer's editor-only runtime to `src/framer-stub.ts`. The real `framer` runtime supplies the property-control panel inside Framer; `framer-motion` supplies the animation primitives in both the standalone preview and the code component.

## Component entry point

`src/SkillpathCourses.tsx` — paste this into Framer as the code component. It imports the adjacent `src/skillpath.css` file so the component remains styled when moved into Framer.

## Submission honesty

The page intentionally treats the API as unreliable. It does not hide a failed country request behind a guessed locale, and it does not let an empty or failed response blank the page. The standalone preview includes visual framing around the required course component, but all course content and prices come from the supplied API.
