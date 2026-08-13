# Skillpath — WebVeda technical assessment

This repository contains the Framer code component and a standalone preview for the WebVeda junior developer assignment.

## What is implemented

- Live `GET` requests to both assignment endpoints; no hardcoded course data.
- Independent handling of course and country failures. If course data works but pricing fails, the cards stay usable and show `Price unavailable` instead of assuming a country.
- Loading skeletons, full error state, zero-result state, retry actions, and no-match search state.
- Correct unit conversion: paise → rupees and USD cents → dollars.
- Search, price sorting, and a refundable badge as optional polish.
- Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile.
- Exactly two Framer property controls: accent color and refundable-badge visibility.
- Accessible labels, status/alert roles, cancellation with `AbortController`, and GET-only requests.

## Local preview

```bash
npm install
npm run dev
```

The Vite preview aliases the Framer runtime to a tiny local stub. In Framer, paste `src/SkillpathCourses.tsx` into a Code Component and Framer will provide the real `framer` runtime and property-control panel.

## Component entry point

`src/SkillpathCourses.tsx` (it imports the adjacent `src/skillpath.css` file so the component stays styled when moved into Framer)

## Assessment note

The page intentionally treats the API as unreliable. It does not hide a failed country request behind a guessed locale, and it does not let an empty or failed response blank the entire page. This is the behavior I would keep before spending time on visual polish.
