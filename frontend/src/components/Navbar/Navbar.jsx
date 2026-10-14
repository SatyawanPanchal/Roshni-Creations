import { useState } from "react";
import TopMarquee from "./TopMarquee";
import MenuBar from "./MenuBar";
import SearchOverlay from "./SearchOverlay";
import ProfileOverlay from "./ProfileOverlay";
import logo from "../../assets/logo.webp";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import LoginSignupOverlay from "../checkout_page_components/LoginSignupOverlay";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <header className="tw:fixed tw:top-0 tw:left-0 tw:z-50 tw:w-full tw:bg-white tw:shadow-sm">
      <TopMarquee />

      <div className="tw:h-16 tw:border-b tw:border-[#eeeeee] tw:px-4">
        <div className="tw:relative tw:h-full tw:mx-auto tw:px-5 tw:sm:px-8 tw:lg:px-12">
          <div className="tw:absolute tw:left-5 tw:sm:left-8 tw:lg:left-12 tw:top-1/2 tw:-translate-y-1/2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="tw:text-[#3e4947] tw:hover:text-[#176b62] tw:transition-colors"
              aria-label="Search"
            >
              <i className="pi pi-search tw:text-[17px] tw:cursor-pointer" />
            </button>
          </div>

          <a
            href="/"
            className="tw:absolute tw:left-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2 tw:flex tw:items-center tw:gap-3"
          >
            <img
              src={logo}
              alt="Roshni Creations"
              className="tw:w-14.5 tw:h-14.5 tw:object-contain"
            />
            <span className="tw:hidden tw:sm:block tw:text-[27px] tw:md:text-[30px] tw:font-serif tw:text-[#176b62] tw:whitespace-nowrap">
              Roshni Creations
            </span>
          </a>

          <div className="tw:absolute tw:right-5 tw:sm:right-8 tw:lg:right-12 tw:top-1/2 tw:-translate-y-1/2 tw:flex tw:items-center tw:gap-5">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="tw:text-[#3e4947] tw:hover:text-[#176b62] tw:transition-colors"
              aria-label="Account"
            >
              <i className="pi pi-user tw:text-[17px] tw:cursor-pointer" />
            </button>

            <div
              onClick={() => navigate("/cart")}
              className="tw:relative tw:cursor-pointer"
            >
              <button type="button" className="tw:relative">
                <i className="pi pi-shopping-bag" />
              </button>

              {cartCount > 0 && (
                <span
                  className="
        tw:absolute
        tw:-top-2
        tw:-right-2
        tw:flex
        tw:h-5
        tw:min-w-5
        tw:px-1
        tw:items-center
        tw:justify-center
        tw:rounded-full
        tw:bg-[#006f68]
        tw:text-white
        tw:text-[10px]
        tw:font-semibold
      "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <MenuBar />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ProfileOverlay
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogin={() => {
          setIsProfileOpen(false);
          setShowLogin(true);
        }}
      />
      <LoginSignupOverlay
        visible={showLogin}
        onHide={() => setShowLogin(false)}
      />
    </header>
  );
};

export default Navbar;
