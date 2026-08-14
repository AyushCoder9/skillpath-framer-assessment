import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";
import "./skillpath.css";

const API_BASE_URL = "https://syncsphere-hiv6.onrender.com";
const COURSE_DATA_URL = `${API_BASE_URL}/assignment/course-data`;
const COUNTRY_CODE_URL = `${API_BASE_URL}/assignment/country-code`;

type CountryCode = "IN" | "US";

export type Course = {
  courseName: string;
  courseCode: string;
  description: string;
  mainCategory: string;
  shortCourse: string;
  courseType: string;
  pricePaise: number;
  priceUsdCents: number;
  mangoId: string;
  refundable: boolean;
};

type Props = {
  accentColor?: string;
  showRefundableBadge?: boolean;
  style?: React.CSSProperties;
};

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.06, staggerChildren: 0.055 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const errorMessage = (error: unknown) => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request cancelled";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong while loading this section.";
};

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`The service returned ${response.status}.`);
  }

  try {
    return await response.json() as T;
  } catch {
    throw new Error("The service returned invalid JSON.");
  }
}

function isCourseArray(value: unknown): value is Course[] {
  return (
    Array.isArray(value) &&
    value.every(
      (course) =>
        course &&
        typeof course === "object" &&
        typeof (course as Course).courseName === "string" &&
        typeof (course as Course).courseCode === "string" &&
        typeof (course as Course).description === "string" &&
        typeof (course as Course).mainCategory === "string" &&
        typeof (course as Course).shortCourse === "string" &&
        typeof (course as Course).courseType === "string" &&
        Number.isFinite((course as Course).pricePaise) &&
        (course as Course).pricePaise >= 0 &&
        Number.isFinite((course as Course).priceUsdCents) &&
        (course as Course).priceUsdCents >= 0 &&
        typeof (course as Course).refundable === "boolean",
    )
  );
}

function isCountryResponse(value: unknown): value is { country_code: CountryCode } {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    ((value as { country_code?: unknown }).country_code === "IN" ||
      (value as { country_code?: unknown }).country_code === "US")
  );
}

async function fetchCourseData(signal: AbortSignal): Promise<Course[]> {
  const value = await getJson<unknown>(COURSE_DATA_URL, signal);
  if (!isCourseArray(value)) throw new Error("The course response was not in the expected format.");
  return value;
}

async function fetchCountryCode(signal: AbortSignal): Promise<CountryCode> {
  const value = await getJson<unknown>(COUNTRY_CODE_URL, signal);
  if (!isCountryResponse(value)) throw new Error("The country response was not in the expected format.");
  return value.country_code;
}

export function formatCoursePrice(course: Course, countryCode: CountryCode | null) {
  if (countryCode === "IN") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(course.pricePaise / 100);
  }

  if (countryCode === "US") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(course.priceUsdCents / 100);
  }

  return "Price unavailable";
}

function priceValue(course: Course, countryCode: CountryCode | null) {
  return countryCode === "US" ? course.priceUsdCents : course.pricePaise;
}

function SignalDot({ tone = "blue" }: { tone?: "blue" | "mint" | "amber" }) {
  return <span aria-hidden="true" className={`skillpath-signal-dot skillpath-signal-dot-${tone}`} />;
}

function getCourseVisualSeed(courseCode: string) {
  const hash = [...courseCode].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
  return {
    gradient: (hash % 4) + 1,
    index: String((hash % 97) + 1).padStart(2, "0"),
  };
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="skillpath-card skillpath-card-skeleton"
      aria-hidden="true"
      initial={{ opacity: 0.4, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease }}
    >
      <div className="skillpath-skeleton-bar skillpath-skeleton-bar-small" />
      <div className="skillpath-skeleton-block" />
      <div className="skillpath-skeleton-line skillpath-skeleton-line-wide" />
      <div className="skillpath-skeleton-line" />
      <div className="skillpath-skeleton-footer" />
    </motion.div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      className="skillpath-state"
      role="status"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="skillpath-state-mark" aria-hidden="true"><span /><span /><span /></div>
      <p className="skillpath-state-kicker">EMPTY CATALOGUE</p>
      <h3>No courses found</h3>
      <p>There are no courses to show right now. Try loading the catalogue again.</p>
      <button className="skillpath-button skillpath-button-secondary" onClick={onRetry}>Try again <span aria-hidden="true">↗</span></button>
    </motion.div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      className="skillpath-state skillpath-state-error"
      role="alert"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="skillpath-state-mark skillpath-state-mark-error" aria-hidden="true">!</div>
      <p className="skillpath-state-kicker">CATALOGUE OFFLINE</p>
      <h3>We couldn&apos;t load the courses</h3>
      <p>{message} The page is still intact; retry when the catalogue service is reachable.</p>
      <button className="skillpath-button skillpath-button-secondary" onClick={onRetry}>Retry request <span aria-hidden="true">↗</span></button>
    </motion.div>
  );
}

function CourseCard({
  course,
  countryCode,
  showRefundableBadge,
  reducedMotion,
}: {
  course: Course;
  countryCode: CountryCode | null;
  showRefundableBadge: boolean;
  reducedMotion: boolean | null;
}) {
  const displayPrice = formatCoursePrice(course, countryCode);
  const visualSeed = getCourseVisualSeed(course.courseCode);
  const gradientClass = `skillpath-card-art-${visualSeed.gradient}`;

  return (
    <motion.article
      layout
      className="skillpath-card skillpath-course-card"
      variants={itemVariants}
      whileHover={reducedMotion ? undefined : { y: -7, rotateX: 1.5, rotateY: -1.5 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{ layout: { duration: 0.42, ease } }}
    >
      <div className={`skillpath-card-art ${gradientClass}`} aria-hidden="true">
        <span className="skillpath-card-art-kicker">LIVE COURSE / {visualSeed.index}</span>
        <span className="skillpath-art-line skillpath-art-line-one" />
        <span className="skillpath-art-line skillpath-art-line-two" />
        <span className="skillpath-art-orb" />
        <span className="skillpath-art-index">{visualSeed.index}</span>
        <span className="skillpath-art-arrow" aria-hidden="true">↗</span>
      </div>
      <div className="skillpath-card-content">
        <div className="skillpath-card-topline">
          <span className="skillpath-category">{course.mainCategory}</span>
          {showRefundableBadge && course.refundable && <span className="skillpath-badge"><SignalDot tone="mint" /> Refundable</span>}
        </div>
        <div className="skillpath-card-heading-row">
          <h3>{course.courseName}</h3>
          <span className="skillpath-card-arrow" aria-hidden="true">↗</span>
        </div>
        <p>{course.description}</p>
        <div className="skillpath-card-footer">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${countryCode ?? "unknown"}-${displayPrice}`}
                className="skillpath-price"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reducedMotion ? 0 : 0.22, ease }}
              >{displayPrice}</motion.span>
            </AnimatePresence>
            <span className="skillpath-price-caption">{countryCode ? `Regional price · ${countryCode}` : "Awaiting regional price"}</span>
          </div>
          <span className="skillpath-course-type">{course.shortCourse || course.courseType}</span>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function SkillpathCourses({
  accentColor = "#2D62FF",
  showRefundableBadge = true,
  style,
}: Props) {
  const [courses, setCourses] = React.useState<Course[] | null>(null);
  const [countryCode, setCountryCode] = React.useState<CountryCode | null>(null);
  const [courseError, setCourseError] = React.useState<string | null>(null);
  const [countryError, setCountryError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<"featured" | "price-low" | "price-high">("featured");
  const [isLoading, setIsLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const [countryRetryCount, setCountryRetryCount] = React.useState(0);
  const [isCountryLoading, setIsCountryLoading] = React.useState(true);
  const reducedMotion = useReducedMotion();

  const retry = React.useCallback(() => {
    setCountryCode(null);
    setRetryCount((count) => count + 1);
    setCountryRetryCount((count) => count + 1);
  }, []);

  const retryCountry = React.useCallback(() => {
    setCountryCode(null);
    setCountryRetryCount((count) => count + 1);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setCourseError(null);

    fetchCourseData(controller.signal)
      .then((nextCourses) => {
        if (controller.signal.aborted) return;
        setCourses(nextCourses);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCourseError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [retryCount]);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsCountryLoading(true);
    setCountryError(null);

    fetchCountryCode(controller.signal)
      .then((nextCountryCode) => {
        if (!controller.signal.aborted) setCountryCode(nextCountryCode);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCountryError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsCountryLoading(false);
      });

    return () => controller.abort();
  }, [retryCount, countryRetryCount]);

  const visibleCourses = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = (courses ?? []).filter((course) => {
      const haystack = `${course.courseName} ${course.description} ${course.mainCategory} ${course.shortCourse} ${course.courseType}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
    if (sort === "price-low") return [...filtered].sort((a, b) => priceValue(a, countryCode) - priceValue(b, countryCode));
    if (sort === "price-high") return [...filtered].sort((a, b) => priceValue(b, countryCode) - priceValue(a, countryCode));
    return filtered;
  }, [courses, countryCode, query, sort]);

  const loadedCourseCount = courses?.length ?? 0;
  const catalogueCount = isLoading || courseError ? "—" : String(loadedCourseCount);
  const catalogueLabel = isLoading ? "loading courses" : courseError ? "catalogue unavailable" : loadedCourseCount === 1 ? "course loaded" : "courses loaded";
  const regionLabel = courseError ? "Awaiting catalogue" : countryCode === "IN" ? "India pricing" : countryCode === "US" ? "US pricing" : isCountryLoading ? "Pricing syncing" : "Price paused";

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className="skillpath-courses"
        style={{ ...style, "--skillpath-accent": accentColor } as React.CSSProperties}
        aria-labelledby="skillpath-courses-heading"
        aria-busy={isLoading}
      >
        <div className="skillpath-section-heading">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
          >
            <div className="skillpath-heading-line">
              <p className="skillpath-eyebrow">LIVE CATALOGUE</p>
              <span className="skillpath-heading-status"><SignalDot tone={courseError ? "amber" : "mint"} />{courseError ? "reconnecting" : isLoading ? "syncing" : "online"}</span>
            </div>
            <h2 id="skillpath-courses-heading">Explore the catalogue</h2>
            <p className="skillpath-section-description">Find the right course.<br />Right when you need it.</p>
          </motion.div>
          <motion.div
            className="skillpath-catalogue-meta"
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            aria-live="polite"
          >
            <strong>{catalogueCount}</strong>
            <span>{catalogueLabel}</span>
            <small>{regionLabel}</small>
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {countryError && !courseError && !isLoading && (
            <motion.div className="skillpath-notice" role="status" initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : 0.32, ease }}>
              <span><SignalDot tone="amber" />Course data is live, but regional pricing is temporarily unavailable.</span>
              <button onClick={retryCountry}>Retry pricing</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {!isLoading && courseError ? (
            <ErrorState key="error" message={courseError} onRetry={retry} />
          ) : isLoading ? (
            <motion.div key="loading" className="skillpath-grid" aria-label="Loading courses" variants={containerVariants} initial="hidden" animate="visible">
              {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} index={index} />)}
            </motion.div>
          ) : courses && courses.length === 0 ? (
            <EmptyState key="empty" onRetry={retry} />
          ) : visibleCourses.length === 0 ? (
            <motion.div key="no-match" className="skillpath-state" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              <div className="skillpath-state-mark" aria-hidden="true"><span /><span /><span /></div>
              <p className="skillpath-state-kicker">NO MATCH</p>
              <h3>Nothing matches that search</h3>
              <p>Try a course name, category, or skill—or clear the filter.</p>
              <button className="skillpath-button skillpath-button-secondary" onClick={() => setQuery("")}>Clear search</button>
            </motion.div>
          ) : (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
              <div className="skillpath-toolbar">
                <label className="skillpath-search">
                  <span className="skillpath-search-icon" aria-hidden="true">⌕</span>
                  <span className="skillpath-visually-hidden">Search courses</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, skills, or topics" type="search" />
                  {query && <span className="skillpath-search-count">{visibleCourses.length}</span>}
                </label>
                <label className="skillpath-sort">
                  <span className="skillpath-sort-label">Sort by</span>
                  <span className="skillpath-visually-hidden">Sort courses</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
              <motion.div className="skillpath-grid" variants={containerVariants} initial="hidden" animate="visible" layout>
                {visibleCourses.map((course) => (
                  <CourseCard key={course.courseCode} course={course} countryCode={countryCode} showRefundableBadge={showRefundableBadge} reducedMotion={reducedMotion} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </MotionConfig>
  );
}

addPropertyControls(SkillpathCourses, {
  accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#2D62FF" },
  showRefundableBadge: { type: ControlType.Boolean, title: "Refundable badge", defaultValue: true },
});

export default SkillpathCourses;
