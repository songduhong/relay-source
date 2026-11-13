import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Boxes, ClipboardCheck, ShieldAlert, Ship, type LucideIcon } from "lucide-react";
import { blogPosts, getBlogCategory, getBlogPost, type BlogCategorySlug } from "@/data/blogPosts";

const categoryIcons: Record<BlogCategorySlug, LucideIcon> = {
  "sourcing-sampling": Boxes,
  "fake-vs-real": ShieldAlert,
  "qc-inspection": ClipboardCheck,
  "logistics-ddp": Ship
};

function headingId(heading: string, index: number) {
  return `section-${index + 1}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  const category = post ? getBlogCategory(post.category) : undefined;

  useEffect(() => {
    document.title = post ? `${post.title} — SourcingRelay Blog` : "Article not found — SourcingRelay";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      post?.excerpt ?? "Browse practical sourcing, verification, QC and logistics guides from SourcingRelay."
    );
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [post]);

  if (!post || !category) {
    return (
      <main className="section article-not-found">
        <div className="container">
          <span className="eyebrow">Sourcing intelligence</span>
          <h1>That article could not be found.</h1>
          <p>The link may be old or the guide may have moved.</p>
          <Link className="btn btn-primary" to="/blog">Browse all articles</Link>
        </div>
      </main>
    );
  }

  const CategoryIcon = categoryIcons[post.category];
  const relatedPosts = blogPosts
    .filter((candidate) => candidate.category === post.category && candidate.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="blog-article-page">
      <div className="container blog-article-top">
        <Link className="blog-back-link" to="/blog">← All sourcing guides</Link>
        <div className="blog-article-hero">
          <span className="post-cat">{category.name}</span>
          <h1>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="post-meta">
            <span className="avatar-sm">SR</span>
            <span>SourcingRelay Buyer Desk</span>
            <time dateTime={post.dateISO}>{post.date}</time>
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="blog-article-cover" aria-hidden="true">
          <span><CategoryIcon /></span>
          <small>SourcingRelay field guide</small>
        </div>
      </div>

      <div className="container blog-article-layout">
        <article className="article-body blog-article-body">
          {post.sections.map((section, index) => (
            <section key={section.heading} id={headingId(section.heading, index)}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
              {section.takeaway && (
                <div className="takeaway"><strong>Key takeaway:</strong> {section.takeaway}</div>
              )}
            </section>
          ))}
          <div className="article-cta">
            <div>
              <h2>Need this checked against your order?</h2>
              <p>Send your buy list. We will show supplier assumptions, product risks and the checks needed before dispatch.</p>
            </div>
            <Link className="btn btn-primary" to="/quote">Request a quote</Link>
          </div>
        </article>

        <aside className="blog-article-side">
          <div className="side-card blog-toc">
            <h2>In this guide</h2>
            <ol>
              {post.sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#${headingId(section.heading, index)}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </div>
          <div className="side-card">
            <h2>Article tags</h2>
            <div className="blog-tag-row">
              {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="section tight blog-related-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Keep reading</span>
              <h2>More {category.name.toLowerCase()}.</h2>
            </div>
            <div className="blog-related-grid">
              {relatedPosts.map((related) => (
                <Link key={related.slug} to={`/blog/${related.slug}`} className="blog-related-card">
                  <span>{(() => {
                    const RelatedIcon = categoryIcons[related.category];
                    return <RelatedIcon aria-hidden="true" />;
                  })()}</span>
                  <small>{related.readTime}</small>
                  <h3>{related.title}</h3>
                  <p>{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
