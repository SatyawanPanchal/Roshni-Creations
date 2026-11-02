// =====================================================================
// Journal.jsx  -  the /journal listing page
//
// Uses the "tw:" Tailwind prefix (same as the rest of the project).
// Colours used:
//   green  #0F3E35  (main brand colour, from the product page button)
//   rose   #C68B7B  (thin lines and underline)
//   ivory  #FAF7F5  (page background)
//   champagne #F7E8D7 (care panel, active page)
//   dark   #2D2525  (text)
// =====================================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  articles,
  careEdit,
  CARE_PAGE_URL,
  CATEGORIES,
  ARTICLES_PER_PAGE,
} from "../data/journalData";

// Serif font used for headings. Change this if your site already has a
// class for it (the product page uses an elegant serif like Cormorant).
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

// ---------- Small helper pieces (kept in this file for simplicity) ----------

// Small uppercase label, e.g. "BUYING GUIDES"
function Label({ children }) {
  return (
    <p className="tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-[#0F3E35]">
      {children}
    </p>
  );
}

// "4 min read · Read more ↗" line shown under every article
function ReadLine({ article, linkText }) {
  return (
    <p className="tw:mt-4 tw:text-xs tw:text-[#2D2525]/60">
      {article.readTime}
      <span className="tw:mx-2">·</span>
      <Link
        to={`/journal/${article.slug}`}
        className="tw:text-[#0F3E35] tw:hover:underline"
      >
        {linkText} ↗
      </Link>
    </p>
  );
}

// An image that links to the article page
function ArticleImage({ article, ratioClass }) {
  return (
    <Link
      to={`/journal/${article.slug}`}
      className="tw:block tw:overflow-hidden"
    >
      <img
        src={article.image}
        alt={article.imageAlt}
        className={`tw:w-full tw:object-cover ${ratioClass}`}
      />
    </Link>
  );
}

// An article title that links to the article page
function ArticleTitle({ article, sizeClass }) {
  return (
    <h2
      style={SERIF}
      className={`tw:font-medium tw:text-[#2D2525] ${sizeClass}`}
    >
      <Link to={`/journal/${article.slug}`} className="tw:hover:text-[#0F3E35]">
        {article.title}
      </Link>
    </h2>
  );
}

// ---------- The page ----------

export default function Blogs() {
  // The two pieces of state the page needs
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [currentPage, setCurrentPage] = useState(1);

  // 1) Filter: keep only the articles of the chosen category.
  //    The care panel is NOT in this array, so it is never filtered out.
  const filteredArticles =
    selectedCategory === "All Stories"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  // 2) Paginate: slice out just the articles for the current page.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const articlesOnThisPage = filteredArticles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE,
  );

  // 3) Each article goes into a "slot" of the layout, in order:
  //    1st = big featured, 2nd = right column, 3rd = small left, 4th = gifting row.
  //    If a slot has no article, it is simply undefined and not drawn.
  const [featured, secondary, everyday, fourth] = articlesOnThisPage;

  // When a category is clicked: change category and go back to page 1
  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  // Page numbers: [1, 2, 3 ...] based on how many pages exist
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="tw:bg-[#FAF7F5] tw:text-[#2D2525]">
      <div className="tw:mx-auto tw:max-w-[1180px] tw:px-5 tw:pb-16 tw:pt-12 tw:md:px-8 tw:md:pt-16">
        {/* ============ A. INTRODUCTION ============ */}
        <section className="tw:flex tw:items-center tw:justify-between tw:gap-6 tw:pb-10">
          <div className="tw:max-w-xl tw:m-auto tw:flex tw:items-center tw:justify-between tw:flex-col">
            <Label>The Roshni Journal</Label>
            <h1
              style={SERIF}
              className="tw:mt-5 tw:text-[1.5rem] tw:font-medium tw:leading-[1.1] tw:text-center tw:text-[#2D2525] tw:md:text-[3.2rem]"
            >
              A little inspiration goes a long way.
            </h1>
            <p
              style={SERIF}
              className="tw:mt-6 tw:max-w-md tw:text-sm tw:md:text-lg tw:leading-relaxed tw:text-[#2D2525]/70 tw:text-center"
            >
              Jewellery styling, thoughtful gifting and practical guides for the
              pieces you love.
            </p>
          </div>
        </section>

        {/* ============ B. CATEGORY FILTER ============ */}
        {/* overflow-x-auto makes this row scroll sideways on small phones */}
        <nav
          aria-label="Journal categories"
          className="tw:flex tw:gap-8 tw:overflow-x-auto tw:whitespace-nowrap tw:border-t tw:border-[#2D2525]/10 tw:pt-5 tw:[scrollbar-width:none]"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={
                  "tw:cursor-pointer tw:border-b tw:pb-2 tw:text-sm tw:transition-colors " +
                  (isActive
                    ? "tw:border-[#C68B7B] tw:text-[#0F3E35]"
                    : "tw:border-transparent tw:text-[#2D2525]/70 tw:hover:text-[#0F3E35]")
                }
              >
                {category}
              </button>
            );
          })}
        </nav>

        {/* ============ C. MAIN GRID (65 : 35) ============ */}
        {featured && (
          <section className="tw:mt-8 tw:grid tw:gap-10 tw:md:grid-cols-[65fr_35fr] tw:md:gap-0">
            {/* Left: featured article (landscape image) */}
            <article className="tw:md:border-r tw:md:border-[#2D2525]/10 tw:md:pr-6">
              <ArticleImage
                article={featured}
                ratioClass="tw:aspect-[4/3] tw:md:aspect-[2/1]"
              />
              <div className="tw:mt-5">
                {/* "Featured" is shown only on the first page */}
                <Label>
                  {currentPage === 1 ? "Featured · " : ""}
                  {featured.category}
                </Label>
                <div className="tw:mt-3 tw:max-w-[34rem]">
                  <ArticleTitle
                    article={featured}
                    sizeClass="tw:text-[1.7rem] tw:leading-snug tw:md:text-[2rem]"
                  />
                </div>
                <p className="tw:mt-4 tw:text-[0.95rem] tw:text-[#2D2525]/70">
                  {featured.description}
                </p>
                <ReadLine article={featured} linkText="Read story" />
              </div>
            </article>

            {/* Right: secondary article (portrait-style image) */}
            {secondary && (
              <article className="tw:md:pl-6">
                <ArticleImage
                  article={secondary}
                  ratioClass="tw:aspect-[4/3] tw:md:aspect-[6/5]"
                />
                <div className="tw:mt-5">
                  <Label>{secondary.category}</Label>
                  <div className="tw:mt-3">
                    <ArticleTitle
                      article={secondary}
                      sizeClass="tw:text-[1.5rem] tw:leading-snug"
                    />
                  </div>
                  <p className="tw:mt-4 tw:text-[0.95rem] tw:leading-relaxed tw:text-[#2D2525]/70">
                    {secondary.description}
                  </p>
                  <ReadLine article={secondary} linkText="Read more" />
                </div>
              </article>
            )}
          </section>
        )}

        {/* ============ D. EVERYDAY ARTICLE + CARE PANEL ============ */}
        <section className="tw:mt-10 tw:grid tw:gap-6 tw:border-t tw:border-[#2D2525]/10 tw:pt-8 tw:md:grid-cols-[35fr_65fr]">
          {/* Left: third article (if the page has one) */}
          {everyday ? (
            <article>
              <ArticleImage article={everyday} ratioClass="tw:aspect-[2/1]" />
              <div className="tw:mt-4">
                <Label>{everyday.category}</Label>
                <div className="tw:mt-3 tw:max-w-[15rem]">
                  <ArticleTitle
                    article={everyday}
                    sizeClass="tw:text-[1.4rem] tw:leading-snug"
                  />
                </div>
                <p className="tw:mt-3 tw:max-w-[14rem] tw:text-sm tw:leading-relaxed tw:text-[#2D2525]/70">
                  {everyday.description}
                </p>
                <ReadLine article={everyday} linkText="Read more" />
              </div>
            </article>
          ) : (
            // Empty space on desktop so the care panel keeps its place
            <div className="tw:hidden tw:md:block" />
          )}

          {/* Right: Jewellery Care panel - ALWAYS shown, never filtered */}
          {/* Right: Jewellery Care Editorial Panel */}
          <aside
            className="
  tw:relative
  tw:isolate
  tw:overflow-hidden
  tw:bg-[#F7E8D7]
  tw:min-h-[180px]
  tw:md:min-h-0
  tw:md:aspect-[1.9/1]
"
          >
            {/* Background Image */}
            <img
              src={careEdit.image}
              alt="Dark velvet potli pouch"
              className="
      tw:absolute
      tw:inset-y-0
      tw:right-0
      tw:h-full
      tw:w-[48%]
      tw:object-cover
      tw:object-center
    "
            />

            {/* Image blending gradient */}
            <div
              className="
      tw:absolute
      tw:inset-y-0
      tw:left-0
      tw:z-10
      tw:w-[65%]
      tw:pointer-events-none
    "
              style={{
                background:
                  "linear-gradient(to right, #F7E8D7 55%, rgba(247,232,215,0))",
              }}
            />

            {/* Content */}
            <div
              className="
    tw:relative
    tw:z-20
    tw:flex
    tw:min-h-[180px]
    tw:w-[62%]
    tw:flex-col
    tw:justify-center
    tw:px-5
    tw:py-5
    tw:md:min-h-0
    tw:md:h-full
    tw:md:w-[60%]
    tw:md:px-7
    tw:md:py-6
  "
            >
              <Label>{careEdit.label}</Label>

              <h2
                style={SERIF}
                className="
        tw:mt-2
        tw:text-xl
        tw:font-medium
        tw:leading-tight
        tw:text-[#2D2525]
        tw:md:text-2xl
      "
              >
                {careEdit.heading}
              </h2>

              <p
                className="
      tw:mt-2
      tw:text-xs
      tw:leading-relaxed
      tw:text-[#2D2525]/75
    "
              >
                {careEdit.description}
              </p>

              <Link
                to={CARE_PAGE_URL}
                className="
        tw:mt-3
        tw:inline-block
        tw:text-xs
        tw:font-medium
        tw:text-[#0F3E35]
        tw:hover:underline
      "
              >
                {careEdit.linkText} ↗
              </Link>
            </div>
          </aside>
        </section>

        {/* ============ E. GIFTING / FOURTH ARTICLE ============ */}
        {fourth && (
          <section className="tw:mt-8 tw:grid tw:gap-6 tw:border-t tw:border-[#2D2525]/10 tw:pt-8 tw:md:grid-cols-[35fr_65fr] tw:md:items-center">
            <ArticleImage article={fourth} ratioClass="tw:aspect-[2/1]" />
            <article className="tw:md:pl-2">
              <Label>{fourth.category}</Label>
              <div className="tw:mt-3">
                <ArticleTitle
                  article={fourth}
                  sizeClass="tw:text-[1.5rem] tw:leading-snug"
                />
              </div>
              <p className="tw:mt-3 tw:text-sm tw:text-[#2D2525]/70">
                {fourth.description}
              </p>
              <ReadLine article={fourth} linkText="Read more" />
            </article>
          </section>
        )}

        {/* ============ F. PAGINATION ============ */}
        <nav
          aria-label="Pagination"
          className="tw:mt-10 tw:flex tw:items-center tw:justify-center tw:gap-5 tw:border-t tw:border-[#2D2525]/10 tw:pt-8 tw:text-sm"
        >
          <span className="tw:hidden tw:h-px tw:w-12 tw:bg-[#C68B7B]/60 tw:md:block" />

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="tw:cursor-pointer tw:text-[#2D2525]/70 tw:hover:text-[#0F3E35] tw:disabled:cursor-default tw:disabled:opacity-40"
          >
            ‹ Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setCurrentPage(number)}
              aria-current={number === currentPage ? "page" : undefined}
              className={
                "tw:h-9 tw:w-9 tw:cursor-pointer tw:rounded-full " +
                (number === currentPage
                  ? "tw:bg-[#F7E8D7] tw:text-[#0F3E35]"
                  : "tw:text-[#2D2525]/70 tw:hover:text-[#0F3E35]")
              }
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="tw:cursor-pointer tw:text-[#2D2525]/70 tw:hover:text-[#0F3E35] tw:disabled:cursor-default tw:disabled:opacity-40"
          >
            Next ›
          </button>

          <span className="tw:hidden tw:h-px tw:w-12 tw:bg-[#C68B7B]/60 tw:md:block" />
        </nav>
      </div>
    </main>
  );
}
