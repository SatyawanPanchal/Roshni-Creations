/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/productContext";

const useBackButtonClose = (isOpen, onClose) => {
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ overlay: "search" }, "");

    const handlePopState = () => onClose();

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

  return () => {
    if (window.history.state?.overlay === "search") {
      window.history.back();
    } else {
      onClose();
    }
  };
};

const POPULAR_SEARCHES = [
  "Kundan Jhumka",
  "Bridal Set",
  "Pearl Earrings",
  "Rakhi Edit",
  "Temple Jewellery",
];

const SearchOverlay = ({ isOpen, onClose, topOffset = 0 }) => {
  const [query, setQuery] = useState("");

  const inputRef = useRef(null);

  const requestClose = useBackButtonClose(isOpen, onClose);

  const navigate = useNavigate();

  // Get products from backend through ProductContext
  const { products, loading } = useProducts();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(t);
    }

    document.body.style.overflow = "";
    setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        requestClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, requestClose]);

  /*
   * Create category tiles from backend products
   */
  const categoryTiles = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((product) => {
      if (!product.category) return;

      const category =
        typeof product.category === "object"
          ? product.category.title ||
            product.category.name ||
            product.category.categoryName ||
            product.category.category
          : product.category;

      if (!category) return;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, product.image || product.images?.[0] || "");
      }
    });

    return Array.from(categoryMap.entries()).map(([category, image]) => ({
      category,
      image,
    }));
  }, [products]);

  /*
   * Search backend products
   */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return products
      .filter((product) => {
        const name = String(product.name || "").toLowerCase();

        const category =
          typeof product.category === "object"
            ? String(
                product.category.title ||
                  product.category.name ||
                  product.category.categoryName ||
                  product.category.category ||
                  "",
              ).toLowerCase()
            : String(product.category || "").toLowerCase();

        const subcategory = String(product.subcategory || "").toLowerCase();

        const material = String(product.material || "").toLowerCase();

        const collections = Array.isArray(product.collections)
          ? product.collections
              .map((collection) => String(collection).toLowerCase())
              .join(" ")
          : "";

        return (
          name.includes(q) ||
          category.includes(q) ||
          subcategory.includes(q) ||
          material.includes(q) ||
          collections.includes(q)
        );
      })
      .slice(0, 12);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      style={{ top: topOffset }}
      className="tw:fixed tw:left-0 tw:right-0 tw:bottom-0 tw:z-40 tw:flex tw:flex-col tw:bg-white tw:animate-[searchFadeIn_0.2s_ease-out]"
    >
      <style>
        {`
          @keyframes searchFadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:border-b tw:border-[#eeeeee] tw:px-5 tw:sm:px-8 tw:lg:px-12 tw:py-3.5 tw:shrink-0">
        <button
          onClick={requestClose}
          className="tw:flex tw:items-center tw:gap-2 tw:text-[13px] tw:text-[#3e4947] tw:transition-colors tw:hover:text-[#176b62] tw:cursor-pointer"
        >
          <i className="pi pi-arrow-left tw:text-[14px]" />
          Back to shopping
        </button>

        <button
          onClick={requestClose}
          aria-label="Close search"
          className="tw:flex tw:items-center tw:gap-2 tw:text-[13px] tw:text-[#3e4947] tw:transition-colors tw:hover:text-[#176b62] tw:cursor-pointer"
        >
          Close
          <i className="pi pi-times tw:text-[16px]" />
        </button>
      </div>

      <div className="tw:flex-1 tw:overflow-y-auto">
        <div className="tw:mx-auto tw:max-w-5xl tw:px-5 tw:sm:px-8 tw:lg:px-12 tw:pt-10 tw:sm:pt-12 tw:pb-16">
          {/* Search input */}
          <div className="tw:border-b tw:border-[#173f3a]/15 tw:focus-within:border-[#176b62] tw:pb-4 tw:transition-colors">
            <label
              htmlFor="search-input"
              className="tw:block tw:text-[12px] tw:tracking-wide tw:text-[#3e4947] tw:mb-2"
            >
              What are you looking for?
            </label>

            <div className="tw:flex tw:items-end tw:gap-3">
              <input
                id="search-input"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kundan jhumkas, pearl sets, bridal jewellery..."
                className="tw:flex-1 tw:bg-transparent tw:border-none tw:outline-none tw:font-serif tw:text-[26px] tw:sm:text-[36px] tw:text-[#173f3a] tw:placeholder:text-[#173f3a]/25 tw:leading-tight"
              />

              <i className="pi pi-search tw:text-[22px] tw:sm:text-[26px] tw:text-[#176b62] tw:mb-1" />
            </div>
          </div>

          {/* Initial state */}
          {!query.trim() && (
            <div className="tw:mt-12 tw:sm:mt-16 tw:grid tw:grid-cols-1 tw:lg:grid-cols-[minmax(0,220px)_1fr] tw:gap-10 tw:lg:gap-16">
              {/* Popular searches */}
              <div>
                <p className="tw:font-serif tw:text-[15px] tw:text-[#176b62] tw:mb-4">
                  Popular searches
                </p>

                <ul className="tw:space-y-1 ">
                  {POPULAR_SEARCHES.map((term, i) => (
                    <li key={term}>
                      <button
                        onClick={() => setQuery(term)}
                        className="tw:group tw:flex tw:w-full tw:items-baseline tw:gap-3 tw:py-2 tw:text-left tw:border-b tw:border-[#eeeeee] tw:transition-colors tw:cursor-pointer"
                      >
                        <span className="tw:text-[11px] tw:text-[#3e4947]/40 tw:tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="tw:text-[14px] tw:text-[#3e4947] tw:group-hover:text-[#176b62] tw:transition-colors">
                          {term}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Backend categories */}
              <div>
                <p className="tw:font-serif tw:text-[15px] tw:text-[#176b62] tw:mb-4">
                  Shop by category
                </p>

                {loading ? (
                  <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-4 tw:gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="tw:aspect-[3/4] tw:rounded-sm tw:bg-[#f5f5f5] tw:animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-4 tw:lg:grid-cols-4 tw:gap-3">
                    {categoryTiles.map(({ category, image }) => (
                      <button
                        key={category}
                        onClick={() => setQuery(category)}
                        className="tw:group tw:relative tw:aspect-[3/4] tw:overflow-hidden tw:rounded-sm tw:cursor-pointer"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={category}
                            className="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-110"
                          />
                        ) : (
                          <div className="tw:h-full tw:w-full tw:bg-[#e9eee9]" />
                        )}

                        <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-[#173f3a]/80 tw:via-[#173f3a]/10 tw:to-transparent" />

                        <span className="tw:absolute tw:bottom-3 tw:left-3 tw:right-3 tw:font-serif tw:text-[14px] tw:sm:text-[15px] tw:text-white">
                          {category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading search */}
          {query.trim() && loading && (
            <div className="tw:flex tw:items-center tw:justify-center tw:py-20">
              <i className="pi pi-spin pi-spinner tw:text-[24px] tw:text-[#176b62]" />
            </div>
          )}

          {/* No results */}
          {query.trim() && !loading && results.length === 0 && (
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-20 tw:text-center">
              <p className="tw:font-serif tw:text-[20px] tw:text-[#173f3a]">
                Nothing found for &quot;{query}&quot;
              </p>

              <p className="tw:mt-2 tw:text-[13px] tw:text-[#3e4947]">
                Try a different term, or browse a category above.
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="tw:mt-10 tw:sm:mt-12">
              <p className="tw:text-[12px] tw:tracking-wide tw:text-[#3e4947] tw:mb-5">
                {results.length} result
                {results.length > 1 ? "s" : ""}
              </p>

              <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:lg:grid-cols-4 tw:gap-x-5 tw:gap-y-10">
                {results.map((product) => {
                  const image = product.image || product.images?.[0] || "";
                  const productId = product._id || product.id;

                  return (
                    <button
                      key={productId}
                      type="button"
                      onClick={() => {
                        if (!productId) {
                          console.error("Product ID is missing:", product);
                          return;
                        }

                        // Replace the temporary search-overlay history entry
                        // with the actual product page.
                        navigate(`/description/${productId}`, {
                          replace: true,
                        });

                        // Close the overlay
                        onClose();
                      }}
                      className="tw:group tw:block tw:w-full tw:text-left tw:cursor-pointer"
                    >
                      <div className="tw:relative tw:aspect-[4/5] tw:overflow-hidden tw:bg-[#faf9f6]">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-105"
                          />
                        ) : (
                          <div className="tw:h-full tw:w-full tw:bg-[#f5f5f5]" />
                        )}

                        {product.badge && (
                          <span className="tw:absolute tw:top-3 tw:left-3 tw:bg-white tw:text-[#173f3a] tw:text-[10px] tw:tracking-wide tw:px-2 tw:py-1">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <p className="tw:mt-3 tw:font-serif tw:text-[14px] tw:sm:text-[15px] tw:text-[#173f3a] tw:truncate">
                        {product.name}
                      </p>

                      <p className="tw:text-[13px] tw:text-[#3e4947] tw:mt-0.5">
                        {product.subcategory || product.category}
                        {" · "}₹{product.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
