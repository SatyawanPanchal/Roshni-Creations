import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoryService";

const menuItems = [
  {
    label: " All Jewellery",
    dropdown: true,
    type: "all",
  },
  {
    label: "Heavy Jewellery",
    type: "collection",
    value: "Heavy Jewellery",
  },
  {
    label: "Shining Kundans",
    type: "collection",
    value: "Shining Kundan",
  },
  {
    label: "Kashmere Watch",
    type: "collection",
    value: "Kashmere Watch",
  },
  {
    label: "Festive Edits",
    type: "collection",
    value: "Festive Edits",
  },
  {
    label: "Minimal Daily Wear",
    type: "collection",
    value: "Minimal Daily Wear",
  },
];

const MenuBar = () => {
  const navigate = useNavigate();

  const [jewelleryOpen, setJewelleryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH CATEGORIES
  // ============================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        console.log("Categories API response:", response);

        const categoryData = Array.isArray(response)
          ? response
          : Array.isArray(response?.categories)
            ? response.categories
            : Array.isArray(response?.data)
              ? response.data
              : [];

        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ============================================
  // GROUP CATEGORIES
  // ============================================

  const groupedCategories = categories.reduce((groups, category) => {
    const group = category.menuGroup || 1;

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(category);

    return groups;
  }, {});

  // ============================================
  // SORT GROUPS + CATEGORY ORDER
  // ============================================

  const jewelleryDropDown = Object.keys(groupedCategories)
    .sort((a, b) => Number(a) - Number(b))
    .map((group) =>
      groupedCategories[group].sort(
        (a, b) => (a.menuOrder || 0) - (b.menuOrder || 0),
      ),
    );

  // ============================================
  // MAIN MENU CLICK
  // ============================================

  const handleMenuClick = (item) => {
    setJewelleryOpen(false);

    // All Jewellery
    if (item.type === "all") {
      navigate("/products");
      return;
    }

    // Collection
    if (item.type === "collection") {
      navigate(`/products/collection/${encodeURIComponent(item.value)}`);
      return;
    }

    // Category
    if (item.type === "category") {
      navigate(`/products/category/${encodeURIComponent(item.value)}`);
      return;
    }

    // Subcategory
    if (item.type === "subcategory") {
      navigate(`/products/subcategory/${encodeURIComponent(item.value)}`);
    }
  };

  // ============================================
  // CATEGORY CLICK
  // ============================================

  const handleCategoryClick = (category) => {
    setJewelleryOpen(false);

    navigate(`/products/category/${encodeURIComponent(category.category)}`);
  };

  return (
    <div className="tw:bg-white">
      {/* =====================================================
          DESKTOP MENU
      ===================================================== */}

      <nav className="tw:hidden tw:lg:flex tw:h-12 tw:items-center tw:justify-center tw:px-4">
        <div className="tw:flex tw:items-center tw:justify-center tw:gap-8 tw:lg:gap-10">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="tw:relative tw:h-full tw:flex tw:items-center"
              onMouseEnter={() => {
                if (item.dropdown) {
                  setJewelleryOpen(true);
                }
              }}
            >
              {/* =================================================
                  MENU BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() => handleMenuClick(item)}
                className="
                  tw:flex
                  tw:items-center
                  tw:gap-1
                  tw:whitespace-nowrap
                  tw:text-[12px]
                  tw:lg:text-[13px]
                  tw:tracking-[1px]
                  tw:text-[#303b39]
                  tw:hover:text-[#176b62]
                  tw:transition-colors
                  tw:bg-transparent
                  tw:border-none
                  tw:p-0
                  tw:cursor-pointer
                "
              >
                {item.label}

                {item.dropdown && (
                  <i
                    className={`pi ${
                      jewelleryOpen ? "pi-chevron-up" : "pi-chevron-down"
                    } tw:text-[8px] tw:ml-1`}
                  />
                )}
              </button>

              {/* =================================================
                  JEWELLERY MEGA MENU
              ================================================= */}

              {item.dropdown && jewelleryOpen && (
                <div
                  className="
                    tw:absolute
                    tw:top-9.5
                    tw:left-120
                    tw:-translate-x-1/2
                    tw:w-[95vw]
                    tw:max-w-300
                    tw:bg-white
                    tw:border-t
                    tw:border-[#eeeeee]
                    tw:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                    tw:z-50
                  "
                  onMouseEnter={() => setJewelleryOpen(true)}
                  onMouseLeave={() => setJewelleryOpen(false)}
                >
                  <div className="tw:grid tw:grid-cols-5 tw:gap-8 tw:px-10 tw:py-8">
                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (
                      <div className="tw:col-span-5 tw:flex tw:items-center tw:justify-center tw:py-8">
                        <span className="tw:text-sm tw:text-[#6e6a62]">
                          Loading categories...
                        </span>
                      </div>
                    )}

                    {/* =================================================
                        NO CATEGORIES
                    ================================================= */}

                    {!loading && jewelleryDropDown.length === 0 && (
                      <div className="tw:col-span-5 tw:flex tw:items-center tw:justify-center tw:py-8">
                        <span className="tw:text-sm tw:text-[#6e6a62]">
                          No categories available.
                        </span>
                      </div>
                    )}

                    {/* =================================================
                        CATEGORY GROUPS
                    ================================================= */}

                    {!loading &&
                      jewelleryDropDown.map((group, index) => (
                        <div
                          key={index}
                          className="tw:flex tw:flex-col tw:gap-4"
                        >
                          {group.map((category) => (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => handleCategoryClick(category)}
                              className="
                                tw:flex
                                tw:items-center
                                tw:gap-4
                                tw:group
                                tw:border-2
                                tw:border-[#F1EBE0]
                                tw:rounded-lg
                                tw:px-3
                                tw:py-2
                                tw:transition-all
                                tw:duration-200
                                tw:hover:border-[#0C3F37]
                                tw:bg-transparent
                                tw:text-left
                                tw:w-full
                                tw:cursor-pointer
                              "
                            >
                              {/* =================================================
                                  CATEGORY IMAGE
                              ================================================= */}

                              <div
                                className="
                                  tw:w-12
                                  tw:h-12
                                  tw:shrink-0
                                  tw:overflow-hidden
                                  tw:rounded-lg
                                  tw:bg-[#f5f5f5]
                                "
                              >
                                <img
                                  src={category.heroImg}
                                  alt={category.title}
                                  loading="lazy"
                                  className="
                                    tw:w-full
                                    tw:h-full
                                    tw:object-cover
                                    tw:transition-transform
                                    tw:duration-300
                                    tw:group-hover:scale-105
                                  "
                                />
                              </div>

                              {/* =================================================
                                  CATEGORY TITLE
                              ================================================= */}

                              <span
                                className="
                                  tw:text-[13px]
                                  tw:text-[#4b5351]
                                  tw:group-hover:text-[#176b62]
                                  tw:transition-colors
                                "
                              >
                                {category.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MenuBar;
