/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import { PRICE_BOUNDS, SORT_OPTIONS } from "./mockProducts";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/productService";

const ROWS_PER_PAGE = 12;

const DEFAULT_PRICE_RANGE = [PRICE_BOUNDS.min, PRICE_BOUNDS.max];

// ============================================================
// PRODUCT TAG OPTIONS (New / Bestseller / Trending)
// ============================================================

const BADGE_OPTIONS = [
  { value: "new", label: "New" },
  { value: "bestseller", label: "Bestseller" },
  { value: "trending", label: "Trending" },
];

// ============================================================
// NORMALIZE CATEGORY
// ============================================================

const getCategoryName = (category) => {
  if (!category) return "";

  if (typeof category === "string") {
    return category;
  }

  return category.category || category.name || category.title || "";
};

// ============================================================
// NORMALIZE COLLECTION
// ============================================================

const getCollectionName = (collection) => {
  if (!collection) return "";

  if (typeof collection === "string") {
    return collection;
  }

  return collection.title || collection.name || collection.collection || "";
};

// ============================================================
// NORMALIZE SUBCATEGORY
// ============================================================

const getSubcategoryName = (subcategory) => {
  if (!subcategory) return "";

  if (typeof subcategory === "string") {
    return subcategory;
  }

  return subcategory.title || subcategory.name || subcategory.subcategory || "";
};

// ============================================================
// NORMALIZE MATERIAL
// ============================================================

const getMaterialName = (material) => {
  if (!material) return "";

  if (typeof material === "string") {
    return material;
  }

  return material.title || material.name || material.material || "";
};

// ============================================================
// NORMALIZE BADGE
// "NEW", "Best Seller", "best-seller" -> "new", "bestseller"
// ============================================================

const getBadgeValue = (badge) => {
  if (!badge) return "";

  const raw =
    typeof badge === "string"
      ? badge
      : badge.title || badge.name || badge.label || "";

  return String(raw)
    .toLowerCase()
    .replace(/[\s_-]/g, "");
};

// ============================================================
// EMPTY FILTERS
// ============================================================

const emptyFilters = () => ({
  categories: new Set(),
  subcategories: new Set(),
  collections: new Set(),
  materials: new Set(),
  availability: new Set(),
  badges: new Set(),
  priceRange: DEFAULT_PRICE_RANGE,
});

// ============================================================
// CHECK PRODUCT AGAINST FILTERS
// ============================================================

function matchesExcept(product, filters, skipGroup) {
  const price = Number(product.price) || 0;

  const inPrice =
    price >= filters.priceRange[0] && price <= filters.priceRange[1];

  if (skipGroup !== "price" && !inPrice) {
    return false;
  }

  // ==========================================================
  // CATEGORY
  // ==========================================================

  const categoryName = getCategoryName(product.category);

  if (
    skipGroup !== "categories" &&
    filters.categories.size > 0 &&
    !filters.categories.has(categoryName)
  ) {
    return false;
  }

  // ==========================================================
  // SUBCATEGORY
  // ==========================================================

  const subcategoryName = getSubcategoryName(product.subcategory);

  if (
    skipGroup !== "subcategories" &&
    filters.subcategories.size > 0 &&
    !filters.subcategories.has(subcategoryName)
  ) {
    return false;
  }

  // ==========================================================
  // COLLECTIONS
  // ==========================================================

  const collectionNames = (product.collections || [])
    .map(getCollectionName)
    .filter(Boolean);

  if (
    skipGroup !== "collections" &&
    filters.collections.size > 0 &&
    !collectionNames.some((collection) => filters.collections.has(collection))
  ) {
    return false;
  }

  // ==========================================================
  // MATERIAL
  // ==========================================================

  const materialName = getMaterialName(product.material);

  if (
    skipGroup !== "materials" &&
    filters.materials.size > 0 &&
    !filters.materials.has(materialName)
  ) {
    return false;
  }

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  if (
    skipGroup !== "availability" &&
    filters.availability.size > 0 &&
    !filters.availability.has(product.availability)
  ) {
    return false;
  }

  // ==========================================================
  // BADGE (New / Bestseller / Trending)
  // ==========================================================

  if (
    skipGroup !== "badges" &&
    filters.badges.size > 0 &&
    !filters.badges.has(getBadgeValue(product.badge))
  ) {
    return false;
  }

  return true;
}

// ============================================================
// FACET COUNTS
// ============================================================

function buildFacetCounts(products, filters, group, key) {
  const pool = products.filter((product) =>
    matchesExcept(product, filters, group),
  );

  const counts = {};

  for (const product of pool) {
    // ========================================================
    // COLLECTIONS
    // ========================================================

    if (group === "collections") {
      const collectionNames = (product.collections || [])
        .map(getCollectionName)
        .filter(Boolean);

      collectionNames.forEach((collection) => {
        counts[collection] = (counts[collection] || 0) + 1;
      });

      continue;
    }

    // ========================================================
    // CATEGORY
    // ========================================================

    if (group === "categories") {
      const categoryName = getCategoryName(product.category);

      if (categoryName) {
        counts[categoryName] = (counts[categoryName] || 0) + 1;
      }

      continue;
    }

    // ========================================================
    // SUBCATEGORY
    // ========================================================

    if (group === "subcategories") {
      const subcategoryName = getSubcategoryName(product.subcategory);

      if (subcategoryName) {
        counts[subcategoryName] = (counts[subcategoryName] || 0) + 1;
      }

      continue;
    }

    // ========================================================
    // MATERIAL
    // ========================================================

    if (group === "materials") {
      const materialName = getMaterialName(product.material);

      if (materialName) {
        counts[materialName] = (counts[materialName] || 0) + 1;
      }

      continue;
    }

    // ========================================================
    // BADGE
    // ========================================================

    if (group === "badges") {
      const badgeValue = getBadgeValue(product.badge);

      if (badgeValue) {
        counts[badgeValue] = (counts[badgeValue] || 0) + 1;
      }

      continue;
    }

    // ========================================================
    // OTHER VALUES
    // ========================================================

    const value = product[key];

    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  }

  return counts;
}

// ============================================================
// SORT PRODUCTS
// ============================================================

function sortProducts(products, sortBy) {
  const list = [...products];

  switch (sortBy) {
    case "price-asc":
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

    case "price-desc":
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );

    default:
      return list;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function ProductListing() {
  const navigate = useNavigate();

  const { category, subcategory, collection } = useParams();
  const [searchParams] = useSearchParams();
  const badge = searchParams.get("badge");

  // ==========================================================
  // PRODUCT STATE
  // ==========================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [sortBy, setSortBy] = useState("featured");

  const [first, setFirst] = useState(0);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [favorites, setFavorites] = useState(new Set());

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        /*
          Supports:

          {
            success: true,
            products: [...]
          }

          or:

          {
            data: [...]
          }

          or:

          [...]
        */

        const productData = response?.products || response?.data || response;

        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================================
  // INITIAL FILTERS FROM URL
  // ==========================================================

  const [filters, setFilters] = useState(() => {
    const initialFilters = emptyFilters();

    if (category) {
      initialFilters.categories.add(decodeURIComponent(category));
    }

    if (subcategory) {
      initialFilters.subcategories.add(decodeURIComponent(subcategory));
    }

    if (collection) {
      initialFilters.collections.add(decodeURIComponent(collection));
    }

    return initialFilters;
  });

  // ==========================================================
  // UPDATE FILTERS WHEN URL CHANGES
  // ==========================================================

  useEffect(() => {
    const nextFilters = emptyFilters();

    if (category) {
      nextFilters.categories.add(decodeURIComponent(category));
    }

    if (subcategory) {
      nextFilters.subcategories.add(decodeURIComponent(subcategory));
    }

    if (collection) {
      nextFilters.collections.add(decodeURIComponent(collection));
    }
    if (badge) nextFilters.badges.add(badge);

    setFilters(nextFilters);
    setFirst(0);
  }, [category, subcategory, collection, badge]);

  // ==========================================================
  // FAVORITES
  // ==========================================================

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  // ==========================================================
  // FILTER ACTIONS
  // ==========================================================

  const toggleFilter = (group, value) => {
    setFilters((prev) => {
      const next = new Set(prev[group]);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      return {
        ...prev,
        [group]: next,
      };
    });
  };

  const setPriceRange = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearAll = () => {
    setFilters(emptyFilters());
    setFirst(0);

    navigate("/products");
  };

  // ==========================================================
  // ACTIVE FILTER COUNT
  // ==========================================================

  const nonPriceCount =
    filters.categories.size +
    filters.subcategories.size +
    filters.collections.size +
    filters.materials.size +
    filters.availability.size +
    filters.badges.size;

  const activeCount =
    nonPriceCount +
    (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
      ? 1
      : 0);

  // ==========================================================
  // RESET PAGINATION
  // ==========================================================

  useEffect(() => {
    setFirst(0);
  }, [filters, sortBy]);

  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => matchesExcept(product, filters, null));
  }, [products, filters]);

  // ==========================================================
  // SORT PRODUCTS
  // ==========================================================

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy);
  }, [filteredProducts, sortBy]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const pageProducts = sortedProducts.slice(first, first + ROWS_PER_PAGE);

  // ==========================================================
  // FACET COUNTS
  // ==========================================================

  const categoryFacets = useMemo(
    () => buildFacetCounts(products, filters, "categories", "category"),
    [products, filters],
  );

  const collectionFacets = useMemo(
    () => buildFacetCounts(products, filters, "collections", "collections"),
    [products, filters],
  );

  // const materialFacets = useMemo(
  //   () => buildFacetCounts(products, filters, "materials", "material"),
  //   [products, filters],
  // );

  const availabilityFacets = useMemo(
    () => buildFacetCounts(products, filters, "availability", "availability"),
    [products, filters],
  );

  const badgeFacets = useMemo(
    () => buildFacetCounts(products, filters, "badges", "badge"),
    [products, filters],
  );

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const categories = useMemo(() => {
    const values = [
      ...new Set(
        products
          .map((product) => getCategoryName(product.category))
          .filter(Boolean),
      ),
    ];

    return values.map((name) => ({
      name,
      count: categoryFacets[name] || 0,
    }));
  }, [products, categoryFacets]);

  // ==========================================================
  // COLLECTION OPTIONS
  // ==========================================================

  const collections = useMemo(() => {
    const values = [
      ...new Set(
        products
          .flatMap((product) => product.collections || [])
          .map(getCollectionName)
          .filter(Boolean),
      ),
    ];

    return values.map((name) => ({
      name,
      count: collectionFacets[name] || 0,
    }));
  }, [products, collectionFacets]);

  // ==========================================================
  // MATERIAL OPTIONS
  // ==========================================================

  // const materials = useMemo(() => {
  //   const values = [
  //     ...new Set(
  //       products
  //         .map((product) => getMaterialName(product.material))
  //         .filter(Boolean),
  //     ),
  //   ];

  //   return values.map((name) => ({
  //     name,
  //     count: materialFacets[name] || 0,
  //   }));
  // }, [products, materialFacets]);

  // ==========================================================
  // AVAILABILITY OPTIONS
  // ==========================================================

  const availability = useMemo(() => {
    const values = [
      ...new Set(
        products.map((product) => product.availability).filter(Boolean),
      ),
    ];

    return values.map((value) => ({
      value,

      label: value
        .replaceAll("-", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),

      count: availabilityFacets[value] || 0,
    }));
  }, [products, availabilityFacets]);

  // ==========================================================
  // BADGE OPTIONS (New / Bestseller / Trending)
  // ==========================================================

  const badges = useMemo(
    () =>
      BADGE_OPTIONS.map((option) => ({
        ...option,
        count: badgeFacets[option.value] || 0,
      })),
    [badgeFacets],
  );

  // ==========================================================
  // ACTIVE FILTER CHIPS
  // ==========================================================

  const activeChips = [
    ...[...filters.categories].map((value) => ({
      group: "categories",
      value,
      label: value,
    })),

    ...[...filters.subcategories].map((value) => ({
      group: "subcategories",
      value,
      label: value,
    })),

    ...[...filters.collections].map((value) => ({
      group: "collections",
      value,
      label: value,
    })),

    ...[...filters.materials].map((value) => ({
      group: "materials",
      value,
      label: value,
    })),

    ...[...filters.availability].map((value) => ({
      group: "availability",
      value,
      label:
        availability.find((option) => option.value === value)?.label ?? value,
    })),

    ...[...filters.badges].map((value) => ({
      group: "badges",
      value,
      label:
        BADGE_OPTIONS.find((option) => option.value === value)?.label ?? value,
    })),

    ...(activeCount > nonPriceCount
      ? [
          {
            group: "price",
            value: "price",
            label: `₹${filters.priceRange[0].toLocaleString(
              "en-IN",
            )} – ₹${filters.priceRange[1].toLocaleString("en-IN")}`,
          },
        ]
      : []),
  ];

  // ==========================================================
  // REMOVE FILTER CHIP
  // ==========================================================

  const removeChip = (chip) => {
    if (chip.group === "price") {
      setPriceRange(DEFAULT_PRICE_RANGE);
    } else {
      toggleFilter(chip.group, chip.value);
    }
  };

  // ==========================================================
  // FILTER SIDEBAR PROPS
  // ==========================================================

  const filterSidebarProps = {
    categories,
    collections,
    // materials,
    availability,
    badges,
    selected: filters,
    onToggle: toggleFilter,
    onPriceChange: setPriceRange,
    onClearAll: clearAll,
    activeCount,
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="tw:mx-auto tw:max-w-350 tw:bg-[#FAF7F2] tw:px-4 tw:py-6 tw:sm:px-6 tw:lg:px-8">
      <div className="tw:flex tw:gap-8">
        {/* ====================================================
            DESKTOP FILTER SIDEBAR
        ==================================================== */}

        <aside className="tw:hidden tw:w-64 tw:shrink-0 tw:lg:block tw:xl:w-72">
          <div className="tw:sticky tw:top-6">
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </aside>

        {/* ====================================================
            MAIN COLUMN
        ==================================================== */}

        <div className="tw:min-w-0 tw:flex-1">
          {/* ==================================================
            TOOLBAR
           ================================================== */}

          <div className="tw:flex tw:flex-col tw:gap-3 tw:sm:flex-row tw:sm:flex-wrap tw:sm:items-center tw:sm:justify-between">
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              {/* Mobile Filters */}

              <Button
                onClick={() => setMobileFiltersOpen(true)}
                className="
        tw:relative
        tw:lg:hidden
        tw:!text-[#13342A]
        tw:!border-[#13342A]
      "
                outlined
                size="small"
              >
                <i className="pi pi-sliders-h tw:mr-2 tw:text-[13px] tw:!text-[#13342A]" />
                Filters
                {activeCount > 0 && (
                  <span className="tw:ml-2 tw:flex tw:h-4 tw:w-4 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#13342A] tw:text-[10px] tw:text-white">
                    {activeCount}
                  </span>
                )}
              </Button>

              <p className="tw:text-[13px] tw:text-stone-500">
                Showing{" "}
                <span className="tw:font-medium tw:text-stone-800">
                  {sortedProducts.length === 0 ? 0 : first + 1}–
                  {Math.min(first + ROWS_PER_PAGE, sortedProducts.length)}
                </span>{" "}
                of{" "}
                <span className="tw:font-medium tw:text-stone-800">
                  {sortedProducts.length}
                </span>{" "}
                products
              </p>
            </div>

            {/* Sort */}

            <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:sm:justify-start">
              <span className="tw:text-[13px] tw:text-stone-500">Sort by:</span>

              <Dropdown
                value={sortBy}
                options={SORT_OPTIONS}
                onChange={(e) => setSortBy(e.value)}
                className="
        tw:w-[150px]
        tw:sm:w-[190px]
        tw:!text-[#13342A]
        tw:!border-[#13342A]
      "
                pt={{
                  root: { className: "tw:!border-[#13342A]" },
                  input: { className: "tw:!text-[#13342A]" },
                  trigger: { className: "tw:!text-[#13342A]" },
                  panel: { className: "tw:!border-[#13342A]" },
                  item: { className: "tw:!text-[#13342A]" },
                }}
              />
            </div>
          </div>

          {/* ==================================================
              ACTIVE FILTER CHIPS
          ================================================== */}

          {activeChips.length > 0 && (
            <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.group}-${chip.value}`}
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="
                    tw:flex
                    tw:items-center
                    tw:gap-1.5
                    tw:rounded-full
                    tw:border
                    tw:!border-[#13342A]
                    tw:bg-white
                    tw:px-3
                    tw:py-1
                    tw:text-[12px]
                    tw:!text-[#13342A]
                    tw:transition-all
                    tw:duration-200
                    tw:hover:!bg-[#13342A]
                    tw:hover:!text-white
                  "
                >
                  {chip.label}

                  <i
                    className="
                      pi
                      pi-times
                      tw:text-[10px]
                      tw:!text-[#13342A]
                    "
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={clearAll}
                className="
                  tw:text-[12px]
                  tw:!text-[#13342A]
                  tw:underline
                  tw:underline-offset-2
                  tw:transition-colors
                  tw:duration-200
                  tw:hover:!text-[#0b211b]
                "
              >
                Clear all
              </button>
            </div>
          )}

          <hr className="tw:my-5 tw:border-stone-200" />

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="tw:grid tw:grid-cols-2 tw:gap-x-4 tw:gap-y-8 tw:sm:gap-x-5 tw:md:grid-cols-3 tw:md:gap-x-6 tw:xl:grid-cols-4">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div key={index} className="tw:animate-pulse">
                  <div className="tw:aspect-[4/5] tw:rounded-md tw:bg-stone-200" />

                  <div className="tw:mt-3 tw:h-4 tw:w-3/4 tw:rounded tw:bg-stone-200" />

                  <div className="tw:mt-2 tw:h-4 tw:w-1/3 tw:rounded tw:bg-stone-200" />
                </div>
              ))}
            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="tw:flex tw:flex-col tw:items-center tw:py-24 tw:text-center">
              <i className="pi pi-exclamation-circle tw:text-3xl tw:text-stone-400" />

              <p className="tw:mt-3 tw:text-[15px] tw:font-medium tw:text-stone-700">
                Unable to load products
              </p>

              <p className="tw:mt-1 tw:text-[13px] tw:text-stone-500">
                {error}
              </p>

              <Button
                label="Try Again"
                outlined
                className="tw:mt-4"
                onClick={() => window.location.reload()}
              />
            </div>
          )}

          {/* ==================================================
              PRODUCTS
          ================================================== */}

          {!loading && !error && pageProducts.length > 0 && (
            <div className="tw:grid tw:grid-cols-2 tw:gap-x-4 tw:gap-y-8 tw:sm:gap-x-5 tw:md:grid-cols-3 tw:md:gap-x-6 tw:xl:grid-cols-4">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorite={favorites.has(product._id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!loading && !error && pageProducts.length === 0 && (
            <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:py-24 tw:text-center">
              <i className="pi pi-search tw:text-3xl tw:text-stone-300" />

              <p className="tw:text-[15px] tw:font-medium tw:text-stone-700">
                No products match those filters
              </p>

              <p className="tw:max-w-xs tw:text-[13px] tw:text-stone-500">
                Try widening the price range or clearing a filter to see more
                results.
              </p>

              <Button
                label="Clear all filters"
                text
                onClick={clearAll}
                className="tw:mt-1"
              />
            </div>
          )}

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {!loading && !error && sortedProducts.length > ROWS_PER_PAGE && (
            <div className="tw:mt-8 tw:flex tw:justify-center tw:overflow-x-auto tw:px-2">
              <Paginator
                first={first}
                rows={ROWS_PER_PAGE}
                totalRecords={sortedProducts.length}
                onPageChange={(e) => {
                  setFirst(e.first);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="tw:cursor-pointer [&_.p-paginator-page.p-highlight]:!text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      <Sidebar
        visible={mobileFiltersOpen}
        onHide={() => setMobileFiltersOpen(false)}
        position="left"
        className="tw:w-[86vw] tw:max-w-sm"
        header={
          <span className="tw:text-[14px] tw:font-semibold">Filter by</span>
        }
      >
        <div className="tw:pb-20">
          <FilterSidebar {...filterSidebarProps} />
        </div>

        <div className="tw:fixed tw:inset-x-0 tw:bottom-0 tw:flex tw:w-[86vw] tw:max-w-sm tw:gap-3 tw:border-t tw:border-stone-200 tw:bg-white tw:p-4">
          <Button
            label="Clear all"
            outlined
            className="tw:flex-1"
            onClick={clearAll}
          />

          <Button
            label={`Show ${filteredProducts.length} results`}
            className="tw:flex-1 tw:!bg-stone-900 tw:!border-stone-900"
            onClick={() => setMobileFiltersOpen(false)}
          />
        </div>
      </Sidebar>
    </div>
  );
}
