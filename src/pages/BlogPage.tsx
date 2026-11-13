import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Boxes,
  ClipboardCheck,
  Search,
  ShieldAlert,
  Ship,
  type LucideIcon
} from "lucide-react";
import {
  blogCategories,
  blogPosts,
  getBlogCategory,
  getBlogPostSearchText,
  type BlogCategorySlug,
  type BlogPost
} from "@/data/blogPosts";
import { postJson } from "@/lib/api";

type CategoryFilter = "all" | BlogCategorySlug;
type NewsletterResponse = { subscribed: boolean; message: string };

const categoryIcons: Record<BlogCategorySlug, LucideIcon> = {
  "sourcing-sampling": Boxes,
  "fake-vs-real": ShieldAlert,
  "qc-inspection": ClipboardCheck,
  "logistics-ddp": Ship
};

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function BlogCard({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.category);
  const Icon = categoryIcons[post.category];

  return (
    <article className={`blog-post-card blog-post-card--${post.category}`}>
      <Link className="blog-post-visual" to={`/blog/${post.slug}`} aria-hidden="true" tabIndex={-1}>
        <span className="blog-post-visual-icon"><Icon aria-hidden="true" /></span>
        <small>{category?.name}</small>
      </Link>
      <div className="blog-date-badge">
        <strong>{post.dateISO.slice(8, 10)}</strong>
        <span>{new Date(`${post.dateISO}T00:00:00`).toLocaleString("en-US", { month: "short" })}</span>
      </div>
      <div className="blog-post-body">
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="blog-tag-row">
          {post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="post-meta">
          <span className="avatar-sm">SR</span>
          <span>SourcingRelay Buyer Desk</span>
          <span className="read-time">{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchDraft, setSearchDraft] = useState(searchParams.get("q") ?? "");
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    document.title = "Sourcing Blog — SourcingRelay";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      "Field-tested sourcing, sampling, counterfeit verification, AQL inspection and DDP logistics guidance for small B2B importers."
    );
  }, []);

  const requestedCategory = searchParams.get("category");
  const activeCategory: CategoryFilter = blogCategories.some((category) => category.slug === requestedCategory)
    ? (requestedCategory as BlogCategorySlug)
    : "all";
  const query = searchParams.get("q")?.trim() ?? "";
  const normalizedQuery = normalizeSearch(query);

  useEffect(() => {
    setSearchDraft(query);
  }, [query]);

  const filteredPosts = useMemo(() => {
    const searchTerms = normalizedQuery.split(" ").filter(Boolean);

    return blogPosts.filter((post) => {
      const categoryMatches = activeCategory === "all" || post.category === activeCategory;
      if (!categoryMatches) return false;
      if (searchTerms.length === 0) return true;

      const searchableText = getBlogPostSearchText(post);
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [activeCategory, normalizedQuery]);

  const filtersActive = activeCategory !== "all" || normalizedQuery.length > 0;
  const featuredPost = !filtersActive ? blogPosts.find((post) => post.featured) : undefined;
  const listedPosts = featuredPost
    ? filteredPosts.filter((post) => post.slug !== featuredPost.slug)
    : filteredPosts;
  const FeaturedIcon = featuredPost ? categoryIcons[featuredPost.category] : undefined;

  function updateFilter(key: "q" | "category", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function scrollToResults() {
    window.requestAnimationFrame(() => {
      document.getElementById("blog-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function applySearch(value: string) {
    const nextQuery = value.trim().replace(/\s+/g, " ");
    setSearchDraft(nextQuery);
    updateFilter("q", nextQuery);
    scrollToResults();
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(searchDraft);
  }

  function selectCategory(category: BlogCategorySlug) {
    updateFilter("category", category);
    scrollToResults();
  }

  function resetFilters() {
    setSearchDraft("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setNewsletterState("error");
      setNewsletterMessage("Enter a valid email address.");
      return;
    }

    setNewsletterState("submitting");
    setNewsletterMessage("");

    try {
      const result = await postJson<NewsletterResponse>("/api/newsletter/subscribe", {
        email: normalizedEmail,
        source: "blog"
      });
      setNewsletterState("success");
      setNewsletterMessage(result.message);
      setEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(error instanceof Error ? error.message : "Could not save your subscription. Please try again.");
    }
  }

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container blog-hero-single">
          <div>
            <span className="eyebrow">Sourcing intelligence</span>
            <h1>Source with fewer surprises.</h1>
            <p className="lead">Field-tested guidance for independent sellers who need the right product, a clean quality check and a delivered cost they can trust.</p>
          </div>
        </div>
      </section>

      <section className="container blog-content">
        <aside className="blog-sidebar">
          <div className="side-card blog-sidebar-search">
            <h2>Search guides</h2>
            <form onSubmit={handleSearch} role="search" aria-label="Article search">
              <label className="sr-only" htmlFor="blog-search">Search all articles</label>
              <div className="blog-sidebar-search-field">
                <Search aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  autoComplete="off"
                  value={searchDraft}
                  placeholder="AQL, fake, DDP…"
                  onChange={(event) => setSearchDraft(event.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Search</button>
            </form>
            <p>Titles, categories, tags and full article text.</p>
          </div>

          <div className="side-card blog-tree-card">
            <div className="blog-rail-heading">
              <h2>Categories</h2>
              <span>{blogPosts.length} guides</span>
            </div>
            <nav aria-label="Guide categories">
              <button
                type="button"
                className={`blog-tree-all${activeCategory === "all" ? " active" : ""}`}
                aria-pressed={activeCategory === "all"}
                onClick={() => {
                  updateFilter("category", "");
                  scrollToResults();
                }}
              >
                <span>All guides</span>
                <strong>{blogPosts.length}</strong>
              </button>
              <ul className="blog-tree">
                {blogCategories.map((category) => {
                  const categoryPosts = blogPosts.filter((post) => post.category === category.slug);
                  const Icon = categoryIcons[category.slug];

                  return (
                    <li key={category.slug} className="blog-tree-branch">
                      <button
                        type="button"
                        className={`blog-tree-category${activeCategory === category.slug ? " active" : ""}`}
                        aria-pressed={activeCategory === category.slug}
                        onClick={() => selectCategory(category.slug)}
                      >
                        <Icon aria-hidden="true" />
                        <span>{category.name}</span>
                        <strong>{categoryPosts.length}</strong>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="side-card newsletter-box">
            <span className="eyebrow">Weekly field note</span>
            <h2>The Shenzhen Memo</h2>
            <p>One practical sourcing email each week: market observations, SKU checks and landed-cost lessons.</p>
            <form onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="newsletter-email">Work email</label>
              <input
                className="nl-input"
                id="newsletter-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                placeholder="you@company.com"
                onChange={(event) => setEmail(event.target.value)}
                disabled={newsletterState === "submitting"}
              />
              <button className="btn btn-primary btn-block" type="submit" disabled={newsletterState === "submitting"}>
                {newsletterState === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            <div className={`newsletter-status ${newsletterState}`} role="status" aria-live="polite">
              {newsletterMessage}
            </div>
            <small>No spam. Your email is stored only for SourcingRelay sourcing updates.</small>
          </div>
        </aside>

        <div className="blog-results" id="blog-results">
          <div className="blog-results-head">
            <div>
              <span className="eyebrow">{filtersActive ? "Filtered guides" : "Latest field notes"}</span>
              <h2>{filtersActive ? `${filteredPosts.length} matching article${filteredPosts.length === 1 ? "" : "s"}` : "Start with the practical details."}</h2>
            </div>
            {filtersActive && (
              <button type="button" className="btn btn-ghost blog-reset" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>

          {featuredPost && (
            <article className="blog-featured-post">
              <Link to={`/blog/${featuredPost.slug}`} className="blog-featured-visual" aria-hidden="true" tabIndex={-1}>
                <span>{FeaturedIcon ? <FeaturedIcon aria-hidden="true" /> : null}</span>
                <small>Featured field guide</small>
              </Link>
              <div className="blog-featured-copy">
                <span className="post-cat">{getBlogCategory(featuredPost.category)?.name} · Featured</span>
                <h2><Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
                <p>{featuredPost.excerpt}</p>
                <div className="post-meta">
                  <span className="avatar-sm">SR</span>
                  <span>SourcingRelay Buyer Desk</span>
                  <time>{featuredPost.date}</time>
                  <span className="read-time">{featuredPost.readTime}</span>
                </div>
              </div>
            </article>
          )}

          {listedPosts.length > 0 ? (
            <div className="blog-card-grid">
              {listedPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="blog-empty">
              <span aria-hidden="true">⌕</span>
              <h3>No articles match those filters.</h3>
              <p>Try a broader product term, such as “sample”, “QC”, “fake” or “customs”.</p>
              <button type="button" className="btn btn-primary" onClick={resetFilters}>View all articles</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
