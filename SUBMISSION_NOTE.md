# Submission note (under 200 words)

With two more days, I would spend the first half running a small matrix of repeated API calls from the published Framer page, including slow responses, an empty array, and a country endpoint failure while course data succeeds. I would use that to tune the retry copy and make sure a slow Render cold start never feels like a broken page. I would then do a final accessibility pass with keyboard navigation and a screen reader, and compare the component at a few intermediate widths between the requested breakpoints.

The part I would be least satisfied with is the lack of a persistent last-known country. I intentionally show “Price unavailable” when the country endpoint fails rather than guessing a currency; that is safer for price accuracy, but it is less convenient for the learner. I would only add cached pricing after confirming the product’s policy for stale prices. I also kept the component’s filtering and sorting local because the assignment API only exposes GET catalogue endpoints and does not need extra server requests.

I used Claude/Codex to help draft the first fetch and component structure. I reviewed and rewrote the loading, independent error, currency-unit, cancellation, accessibility, and responsive-layout behavior, and I would be prepared to explain every line in the submitted component.
