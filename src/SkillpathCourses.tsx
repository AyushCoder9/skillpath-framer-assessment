import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

const API_BASE_URL = "https://syncsphere-hiv6.onrender.com";

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
};

type LoadResult = {
  courses: Course[] | null;
  countryCode: CountryCode | null;
  courseError: string | null;
  countryError: string | null;
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

  return response.json() as Promise<T>;
}

function isCourseArray(value: unknown): value is Course[] {
  return (
    Array.isArray(value) &&
    value.every(
      (course) =>
        course &&
        typeof course === "object" &&
        typeof (course as Course).courseName === "string" &&
        typeof (course as Course).description === "string" &&
        typeof (course as Course).pricePaise === "number" &&
        typeof (course as Course).priceUsdCents === "number",
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

export async function loadSkillpathData(signal: AbortSignal): Promise<LoadResult> {
  const [coursesResult, countryResult] = await Promise.allSettled([
    getJson<unknown>(`${API_BASE_URL}/assignment/course-data`, signal),
    getJson<unknown>(`${API_BASE_URL}/assignment/country-code`, signal),
  ]);

  const courses =
    coursesResult.status === "fulfilled" && isCourseArray(coursesResult.value)
      ? coursesResult.value
      : null;
  const countryCode =
    countryResult.status === "fulfilled" && isCountryResponse(countryResult.value)
      ? countryResult.value.country_code
      : null;

  return {
    courses,
    countryCode,
    courseError:
      coursesResult.status === "rejected"
        ? errorMessage(coursesResult.reason)
        : courses === null
          ? "The course response was not in the expected format."
          : null,
    countryError:
      countryResult.status === "rejected"
        ? errorMessage(countryResult.reason)
        : countryCode === null
          ? "The country response was not in the expected format."
          : null,
  };
}

export function formatCoursePrice(course: Course, countryCode: CountryCode | null) {
  if (countryCode === "IN") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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

function SkeletonCard() {
  return (
    <div className="skillpath-card skillpath-skeleton" aria-hidden="true">
      <div className="skillpath-skeleton-line skillpath-skeleton-short" />
      <div className="skillpath-skeleton-line" />
      <div className="skillpath-skeleton-line skillpath-skeleton-wide" />
      <div className="skillpath-skeleton-price" />
    </div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="skillpath-state" role="status">
      <div className="skillpath-state-icon">⌁</div>
      <h3>No courses found</h3>
      <p>There are no courses to show right now. Try loading the catalogue again.</p>
      <button className="skillpath-button skillpath-button-secondary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="skillpath-state" role="alert">
      <div className="skillpath-state-icon skillpath-error-icon">!</div>
      <h3>We couldn&apos;t load the courses</h3>
      <p>{message} The catalogue is intentionally resilient to temporary API failures.</p>
      <button className="skillpath-button skillpath-button-secondary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function SkillpathCourses({
  accentColor = "#6D5EF5",
  showRefundableBadge = true,
}: Props) {
  const [courses, setCourses] = React.useState<Course[] | null>(null);
  const [countryCode, setCountryCode] = React.useState<CountryCode | null>(null);
  const [courseError, setCourseError] = React.useState<string | null>(null);
  const [countryError, setCountryError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<"featured" | "price-low" | "price-high">("featured");
  const [isLoading, setIsLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);

  const retry = React.useCallback(() => setRetryCount((count) => count + 1), []);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setCourseError(null);
    setCountryError(null);

    loadSkillpathData(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setCourses(result.courses);
        setCountryCode(result.countryCode);
        setCourseError(result.courseError);
        setCountryError(result.countryError);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCourseError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  const visibleCourses = React.useMemo(() => {
    const filtered = (courses ?? []).filter((course) => {
      const haystack = `${course.courseName} ${course.description} ${course.mainCategory} ${course.shortCourse}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });

    if (sort === "price-low") {
      return [...filtered].sort((a, b) => a.pricePaise - b.pricePaise);
    }
    if (sort === "price-high") {
      return [...filtered].sort((a, b) => b.pricePaise - a.pricePaise);
    }
    return filtered;
  }, [courses, query, sort]);

  return (
    <section
      className="skillpath-courses"
      style={{ "--skillpath-accent": accentColor } as React.CSSProperties}
      aria-labelledby="skillpath-courses-heading"
      aria-busy={isLoading}
    >
      <div className="skillpath-section-heading">
        <div>
          <p className="skillpath-eyebrow">LEARN WITH INTENT</p>
          <h2 id="skillpath-courses-heading">Courses built for momentum.</h2>
          <p className="skillpath-section-description">
            Practical systems, taught by people who have done the work.
          </p>
        </div>
        {!isLoading && courses && !courseError && (
          <span className="skillpath-count">{visibleCourses.length} courses</span>
        )}
      </div>

      {countryError && !courseError && (
        <div className="skillpath-notice" role="status">
          <span>Course data is live, but regional pricing is temporarily unavailable.</span>
          <button onClick={retry}>Retry pricing</button>
        </div>
      )}

      {!isLoading && courseError ? (
        <ErrorState message={courseError} onRetry={retry} />
      ) : isLoading ? (
        <div className="skillpath-grid" aria-label="Loading courses">
          {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : courses && courses.length === 0 ? (
        <EmptyState onRetry={retry} />
      ) : visibleCourses.length === 0 ? (
        <div className="skillpath-state" role="status">
          <div className="skillpath-state-icon">⌕</div>
          <h3>No matching courses</h3>
          <p>Try a different search term or clear the filter.</p>
          <button className="skillpath-button skillpath-button-secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="skillpath-toolbar">
            <label className="skillpath-search">
              <span className="skillpath-search-icon">⌕</span>
              <span className="skillpath-visually-hidden">Search courses</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses"
                type="search"
              />
            </label>
            <label className="skillpath-sort">
              <span className="skillpath-visually-hidden">Sort courses</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="skillpath-grid">
            {visibleCourses.map((course) => (
              <article className="skillpath-card" key={course.courseCode}>
                <div className="skillpath-card-topline">
                  <span className="skillpath-category">{course.mainCategory}</span>
                  {showRefundableBadge && course.refundable && (
                    <span className="skillpath-badge">Refundable</span>
                  )}
                </div>
                <h3>{course.courseName}</h3>
                <p>{course.description}</p>
                <div className="skillpath-card-footer">
                  <span className="skillpath-price">{formatCoursePrice(course, countryCode)}</span>
                  <span className="skillpath-course-type">{course.courseType}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

addPropertyControls(SkillpathCourses, {
  accentColor: {
    type: ControlType.Color,
    title: "Accent",
    defaultValue: "#6D5EF5",
  },
  showRefundableBadge: {
    type: ControlType.Boolean,
    title: "Refundable badge",
    defaultValue: true,
  },
});

export default SkillpathCourses;
