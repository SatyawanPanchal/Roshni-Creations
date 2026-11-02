// =====================================================================
// ArticleDetail.jsx  -  one component that shows ANY article page
//
// The URL looks like /journal/jewellery-festive-styling
// The last part ("slug") tells us which article to show. We find it
// in the same articles array that the Journal listing uses.
// =====================================================================
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { articles } from "../data/journalData";

// Same serif as the Journal page (change if your site uses a class for it)
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export default function ArticleDetail() {
  // Read the slug from the URL
  const { slug } = useParams();

  // Find the matching article (undefined if the slug is wrong)
  const article = articles.find((item) => item.slug === slug);

  // Start at the top of the page whenever the article changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // If nobody matches the URL, show a friendly message
  if (!article) {
    return (
      <main className="tw:bg-[#FAF7F5] tw:px-5 tw:py-24 tw:text-center tw:text-[#2D2525]">
        <h1 style={SERIF} className="tw:text-3xl tw:font-medium">
          We could not find that story.
        </h1>
        <Link
          to="/blogs"
          className="tw:mt-6 tw:inline-block tw:text-[#0F3E35] tw:hover:underline"
        >
          ← Back to Journal
        </Link>
      </main>
    );
  }

  // Turn the list of related slugs into real article objects
  const relatedArticles = article.related
    .map((relatedSlug) => articles.find((item) => item.slug === relatedSlug))
    .filter((item) => item !== undefined);

  return (
    <main className="tw:bg-[#FAF7F5] tw:text-[#2D2525]">
      <div className="tw:mx-auto tw:max-w-[1180px] tw:px-5 tw:pb-20 tw:pt-8 tw:md:px-8">
        {/* 1. Breadcrumb: Home / Journal / Article Title */}
        <nav
          aria-label="Breadcrumb"
          className="tw:flex tw:flex-wrap tw:gap-2 tw:text-sm tw:text-[#2D2525]/60"
        >
          <Link to="/" className="tw:hover:text-[#0F3E35]">
            Home
          </Link>
          <span>/</span>
          <Link to="/blogs" className="tw:hover:text-[#0F3E35]">
            Journal
          </Link>
          <span>/</span>
          <span className="tw:text-[#2D2525]">{article.title}</span>
        </nav>

        {/* The reading column is narrower than the page so lines stay easy to read */}
        <article className="tw:mx-auto tw:mt-10 tw:max-w-3xl">
          {/* 2. Category */}
          <p className="tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-[#0F3E35]">
            {article.category}
          </p>

          {/* 3. Title */}
          <h1
            style={SERIF}
            className="tw:mt-4 tw:text-[2.2rem] tw:font-medium tw:leading-[1.1] tw:md:text-[3rem]"
          >
            {article.title}
          </h1>
          <div className="tw:mt-5 tw:h-px tw:w-16 tw:bg-[#D4AF37]" />

          {/* 4. Author and reading time */}
          <p className="tw:mt-5 tw:text-sm tw:text-[#2D2525]/60">
            By {article.author}
            <span className="tw:mx-2">·</span>
            {article.readTime}
          </p>

          {/* 5. Main photograph */}
          <img
            src={article.image}
            alt={article.imageAlt}
            className="tw:mt-8 tw:aspect-[4/3] tw:w-full tw:object-cover tw:md:aspect-[16/9]"
          />

          {/* 6. Short introduction */}
          <p
            style={SERIF}
            className="tw:mt-10 tw:text-[1.35rem] tw:leading-relaxed tw:text-[#2D2525]/85 tw:md:text-[1.5rem]"
          >
            {article.intro}
          </p>

          {/* 7. Full content: one block per section */}
          {article.sections.map((section) => (
            <section key={section.heading} className="tw:mt-12">
              <h2
                style={SERIF}
                className="tw:text-[1.7rem] tw:font-medium tw:leading-snug tw:text-[#0F3E35] tw:md:text-[2rem]"
              >
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="tw:mt-4 tw:text-base tw:leading-[1.8] tw:text-[#2D2525]/80"
                >
                  {paragraph}
                </p>
              ))}

              {/* Optional list of practical tips */}
              {section.tips && (
                <ul className="tw:mt-6 tw:space-y-2 tw:bg-[#F7E8D7] tw:px-6 tw:py-5">
                  {section.tips.map((tip) => (
                    <li
                      key={tip}
                      className="tw:flex tw:gap-3 tw:text-[0.95rem] tw:leading-relaxed tw:text-[#2D2525]/85"
                    >
                      <span className="tw:text-[#0F3E35]">–</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Optional extra photograph */}
              {section.image && (
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="tw:mt-6 tw:aspect-[3/2] tw:w-full tw:object-cover"
                />
              )}
            </section>
          ))}

          {/* 8. Product / collection links */}
          <section className="tw:mt-14 tw:border-t tw:border-[#2D2525]/10 tw:pt-8">
            <h2 style={SERIF} className="tw:text-[1.5rem] tw:font-medium">
              Pieces to explore
            </h2>
            <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-3">
              {article.products.map((product) => (
                <Link
                  key={product.label}
                  to={product.to}
                  className="tw:border tw:border-[#0F3E35] tw:px-5 tw:py-2 tw:text-sm tw:text-[#0F3E35] tw:transition-colors tw:hover:bg-[#0F3E35] tw:hover:text-white"
                >
                  {product.label}
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* 9. Related articles */}
        {relatedArticles.length > 0 && (
          <section className="tw:mt-16 tw:border-t tw:border-[#2D2525]/10 tw:pt-10">
            <h2 style={SERIF} className="tw:text-[1.8rem] tw:font-medium">
              Keep reading
            </h2>
            <div className="tw:mt-6 tw:grid tw:gap-8 tw:sm:grid-cols-2">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/journal/${related.slug}`}
                  className="tw:group tw:block"
                >
                  <img
                    src={related.image}
                    alt={related.imageAlt}
                    className="tw:aspect-[3/2] tw:w-full tw:object-cover"
                  />
                  <p className="tw:mt-4 tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-[#0F3E35]">
                    {related.category}
                  </p>
                  <h3
                    style={SERIF}
                    className="tw:mt-2 tw:text-[1.4rem] tw:font-medium tw:leading-snug tw:group-hover:text-[#0F3E35]"
                  >
                    {related.title}
                  </h3>
                  <p className="tw:mt-2 tw:text-xs tw:text-[#2D2525]/60">
                    {related.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 10. Back link */}
        <div className="tw:mt-14 tw:text-center">
          <Link
            to="/blogs"
            className="tw:text-sm tw:text-[#0F3E35] tw:hover:underline"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    </main>
  );
}
