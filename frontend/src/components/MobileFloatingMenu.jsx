
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileFloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Home",
      icon: "pi pi-home",
      path: "/",
    },
    {
      label: "Products",
      icon: "pi pi-shopping-bag",
      path: "/products",
    },
    {
      label: "Cart",
      icon: "pi pi-shopping-cart",
      path: "/cart",
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div
      ref={menuRef}
      className="
        tw:fixed
        tw:right-6
        tw:bottom-[90px]
        tw:z-[99999]
        tw:flex
        tw:flex-col
        tw:items-end
        tw:gap-3
        tw:md:hidden
        
        tw:pointer-events-none
      "
    >
      {/* MENU ITEMS */}
      <div
        className={`
          tw:flex
          tw:flex-col
          tw:items-end
          tw:gap-3
          tw:transition-all
          tw:duration-300
          tw:ease-out
          tw:pointer-events-auto

          ${
            isOpen
              ? "tw:opacity-100 tw:translate-y-0 tw:pointer-events-auto"
              : "tw:opacity-0 tw:translate-y-4 tw:pointer-events-none"
          }
        `}
      >
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => handleNavigate(item.path)}
            className="
              tw:flex
              tw:items-center
              tw:gap-2
              tw:bg-white
              tw:text-[#1c1c1a]
              tw:rounded-full
              tw:px-4
              tw:py-2.5
              tw:shadow-lg
              tw:border
              tw:border-[#e7e1d5]
              tw:transition-all
              tw:duration-300
              tw:ease-out
              tw:hover:-translate-x-1
              tw:active:scale-95
            "
            style={{
              transitionDelay: isOpen
                ? `${index * 50}ms`
                : "0ms",
            }}
          >
            <i
              className={`${item.icon} tw:text-[16px] tw:text-[#23392c]`}
            />

            <span className="tw:text-sm tw:font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN MENU BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        className="
          tw:w-14
          tw:h-14
          tw:rounded-full
          tw:bg-[#23392c]
          tw:text-white
          tw:flex
          tw:items-center
          tw:justify-center
          tw:shadow-xl
          tw:transition-all
          tw:duration-300
          tw:ease-out
          tw:active:scale-90
          tw:pointer-events-auto
        "
      >
        <i
          className={`
            ${isOpen ? "pi pi-angle-down" : "pi pi-bars"}
            tw:!text-[22px]
            tw:transition-transform
            tw:duration-300
          `}
        />
      </button>
    </div>
  );
};

export default MobileFloatingMenu;
