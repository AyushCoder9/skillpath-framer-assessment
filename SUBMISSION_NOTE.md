# Submission note (under 200 words)

With two more days, I would run a small matrix of repeated calls from the published Framer page, including slow responses, an empty array, and a country endpoint failure while course data succeeds. I would tune the retry copy around that behavior, then do a final accessibility pass with keyboard navigation and a screen reader at intermediate widths.

The part I would be least satisfied with is the lack of a persistent last-known country. I intentionally show “Price unavailable” when the country endpoint fails rather than guessing a currency. That is safer for price accuracy, but less convenient; I would add cached pricing only after confirming the policy for stale prices. Filtering and sorting stay local because the API exposes only GET catalogue endpoints.

I used Claude/Codex to draft the first fetch and component structure. I reviewed and rewrote the loading, independent-error, currency-unit, cancellation, accessibility, and responsive-layout behavior, and I can explain every line in the submitted component.
