/* eslint-disable no-unused-vars */
/**
 * ShopTheLook.jsx
 * ------------------------------------------------------------------
 * Stack: React + Tailwind CSS (prefix: "tw:") + PrimeReact
 *
 * SETUP (one-time, in your app):
 * 1. Tailwind config must have `prefix: "tw:"` set — this file assumes
 *    that's already configured, since every utility class below is
 *    written as `tw:<utility>` (e.g. `tw:texsm:t-4xl`).
 * 2. PrimeReact needs its stylesheet for the Ripple effect on the dot:
 *      import "primereact/resources/primereact.min.css";
 *      import "primeicons/primeicons.css";
 *    (No theme.css is required — this component is styled entirely
 *    with Tailwind, PrimeReact is only used for the Ripple interaction.)
 * 3. Drop `shop-the-look.png` next to this file (or point `imageSrc`
 *    at your own hero photo) and update HOTSPOTS below to match your
 *    photo's dot positions.
 *
 * HOW POSITIONING WORKS:
 * Each hotspot is placed with `top` / `left` as a PERCENTAGE of the
 * image's width/height, so it stays pinned to the right spot on the
 * photo at any screen size. `align` controls which way the card opens
 * (so it never spills off the edge of the image):
 *   - "left"   → card's left edge lines up with the dot (opens rightward)
 *   - "right"  → card's right edge lines up with the dot (opens leftward)
 *   - "center" → card is centered under the dot
 * `anchor` controls whether the card opens "below" or "above" the dot.
 * On phones (below the `sm` breakpoint) the card instead becomes a
 * fixed bottom sheet, since anchored popovers are cramped on small
 * screens and easy to clip off-screen. NOTE: the image keeps the same
 * aspect ratio (16/9) at every breakpoint on purpose — the hotspot
 * top/left percentages are calibrated against that one crop, and
 * switching to a taller mobile crop would throw every dot off the
 * subject it's meant to point to.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { Ripple } from "primereact/ripple";

// images
import shopTheLookImg from "../../images/shopTheLook/shop-the-look.webp";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../context/productContext";

const HOTSPOTS = [
  {
    productId: "6ab35e9bd50f6f4b6d88140c",
    top: 48.5,
    left: 19.5,
    align: "left",
    anchor: "bottom",
  },
  {
    productId: "6ab36e2dd50f6f4b6d88140f",
    top: 48.5,
    left: 49.7,
    align: "center",
    anchor: "bottom",
  },
  {
    productId: "6ab35de4d50f6f4b6d88140b",
    top: 50.5,
    left: 78.5,
    align: "right",
    anchor: "bottom",
  },
];

export default function ShopTheLook({
  imageSrc = shopTheLookImg,
  imageAlt = "Three women in traditional wear, each showcasing a statement necklace",
  hotspots = HOTSPOTS,
  title = "Shop the Look",
  subtitle = "Discover the stories behind our most cherished pieces.",
}) {
  const { products, loading } = useProducts();
  const [activeId, setActiveId] = useState(null);
  const closeTimer = useRef(null);
  const containerRef = useRef(null);

  const open = (id) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveId(id);
  };

  const navigate = useNavigate();

  // small delay so moving the mouse from the dot onto the card doesn't
  // close it in the gap between the two elements
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveId(null), 150);
  };

  const toggle = (id) => setActiveId((current) => (current === id ? null : id));
  const close = () => setActiveId(null);

  // close on outside click / tap and on Escape — mainly for touch devices,
  // where the card is opened with a tap instead of a hover
  useEffect(() => {
    const handleOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveId(null);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setActiveId(null);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // lock background scroll while the mobile bottom sheet is open
  useEffect(() => {
    if (!activeId) return;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId]);

  const shopTheLookProducts = hotspots
    .map((spot) => {
      const product = products?.find(
        (item) => String(item._id || item.id) === String(spot.productId),
      );

      if (!product) return null;

      return {
        ...product,
        ...spot,
        id: product._id || product.id,
      };
    })
    .filter(Boolean);

  const activeSpot =
    shopTheLookProducts.find((spot) => spot.id === activeId) || null;

  return (
    <section className="tw:w-full tw:bg-[#fbf8f2] tw:px-4 tw:py-14 tw:sm:py-20">
      <div className="tw:mx-auto tw:max-w-5xl tw:text-center">
        <h2 className="tw:font-[headings] tw:text-2xl tw:tracking-tight tw:text-stone-900 tw:sm:text-4xl">
          {title}
        </h2>
        <p className="tw:font-[Manrope] tw:mt-3 tw:px-4 tw:text-sm tw:text-stone-500 tw:sm:px-0 tw:sm:text-base">
          {subtitle}
        </p>
      </div>

      <div
        ref={containerRef}
        className="tw:relative tw:mx-auto tw:mt-10 tw:max-w-5xl tw:sm:mt-14"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="tw:aspect-[16/9] tw:w-full tw:rounded-2xl tw:object-cover tw:shadow-xl tw:shadow-stone-900/10"
        />

        {/* Backdrop: dims the page behind the bottom sheet on mobile only.
            Tapping it closes the sheet (outside-click already handles this
            everywhere else, but the backdrop itself sits inside the
            container ref, so it needs its own handler). */}
        <div
          onClick={close}
          aria-hidden="true"
          className={[
            "tw:fixed tw:inset-0 tw:z-10 tw:bg-stone-900/40 tw:transition-opacity tw:duration-200 tw:sm:hidden",
            activeId
              ? "tw:visible tw:opacity-100"
              : "tw:invisible tw:opacity-0",
          ].join(" ")}
        />

        {shopTheLookProducts.map((spot) => {
          const isActive = activeId === spot.id;
          return (
            <div
              key={spot.id}
              className="tw:absolute tw:-translate-x-1/2 tw:-translate-y-1/2"
              style={{ top: `${spot.top}%`, left: `${spot.left}%` }}
            >
              {/* Hotspot dot — button itself is sized to a full 44px touch
                  target on mobile (Apple/Google's minimum recommendation)
                  even though the visible dot stays small; on sm+ screens,
                  where clicks come from a precise cursor, it shrinks back
                  down. The ping and dot are given fixed sizes (rather than
                  h-full/w-full) so they don't balloon with the bigger
                  mobile hit area. */}
              <button
                type="button"
                onClick={() => toggle(spot.id)}
                onMouseEnter={() => open(spot.id)}
                onFocus={() => open(spot.id)}
                aria-expanded={isActive}
                aria-label={`View details for ${spot.name}, ${spot.price}`}
                className="p-ripple tw:group tw:relative tw:flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-full tw:outline-none tw:ring-offset-2 tw:focus-visible:ring-2 tw:focus-visible:ring-amber-400 tw:sm:h-7 tw:sm:w-7"
              >
                <span className="tw:pointer-events-none tw:absolute tw:inset-0 tw:m-auto tw:h-6 tw:w-6 tw:animate-ping tw:rounded-full tw:bg-amber-100/70 tw:sm:h-full tw:sm:w-full" />
                <span
                  className={`tw:relative tw:h-3.5 tw:w-3.5 tw:rounded-full tw:border-2 tw:border-amber-50 tw:bg-stone-900/85 tw:shadow-md tw:transition-transform tw:duration-200 tw:sm:h-4 tw:sm:w-4 ${
                    isActive ? "tw:scale-110" : "tw:group-hover:scale-110"
                  }`}
                />
                <Ripple />
              </button>

              {/* Product card — desktop popover only. Below `sm` this is
                  not rendered at all: the mobile equivalent is the single
                  shared bottom sheet further down, rendered as a sibling
                  of this transformed wrapper. Rendering it in here worked
                  fine for `absolute` (that's what lets it anchor to the
                  dot), but `fixed` doesn't behave the same way — a
                  `transform` on an ancestor (the `-translate-x/y-1/2`
                  above) makes that ancestor the containing block for
                  `fixed` descendants too, so a "fixed, full-width" sheet
                  nested in here actually gets sized and positioned
                  relative to that tiny translated dot, not the viewport —
                  which is why it rendered as a small box in the corner of
                  the dot instead of a real bottom sheet. */}
              <div
                onMouseEnter={() => open(spot.id)}
                onMouseLeave={scheduleClose}
                role="dialog"
                aria-hidden={!isActive}
                onClick={() => navigate(`/description/${spot.id}`)}
                className={[
                  "tw:hidden tw:sm:block",
                  "tw:z-20 tw:rounded-xl tw:bg-white tw:p-3 tw:shadow-2xl tw:shadow-stone-900/20 tw:ring-1 tw:ring-stone-900/5 tw:transition-all tw:duration-200 tw:cursor-pointer",
                  "tw:sm:absolute tw:sm:w-64 tw:sm:origin-top",
                  spot.anchor === "bottom"
                    ? "tw:sm:top-full tw:sm:mt-4"
                    : "tw:sm:bottom-full tw:sm:mb-4",
                  spot.align === "left"
                    ? "tw:sm:left-0"
                    : spot.align === "right"
                      ? "tw:sm:right-0"
                      : "tw:sm:left-1/2 tw:sm:-translate-x-1/2",
                  isActive
                    ? "tw:visible tw:scale-100 tw:opacity-100"
                    : "tw:invisible tw:scale-95 tw:opacity-0",
                ].join(" ")}
              >
                {/* caret pointing back at the dot */}
                <span
                  aria-hidden="true"
                  className={[
                    "tw:absolute tw:h-3 tw:w-3 tw:rotate-45 tw:rounded-xs tw:bg-white tw:ring-1 tw:ring-stone-900/5",
                    spot.anchor === "bottom" ? "tw:-top-1.5" : "tw:-bottom-1.5",
                    spot.align === "left"
                      ? "tw:left-4"
                      : spot.align === "right"
                        ? "tw:right-4"
                        : "tw:left-1/2 tw:-translate-x-1/2",
                  ].join(" ")}
                />

                <div className="tw:flex tw:gap-3">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="tw:h-20 tw:w-20 tw:flex-none tw:rounded-lg tw:object-cover"
                  />
                  <div className="tw:flex tw:min-w-0 tw:flex-col tw:justify-center">
                    <p className="tw:truncate tw:text-sm tw:font-medium tw:text-stone-900">
                      {spot.name}
                    </p>
                    <p className="tw:mt-0.5 tw:truncate tw:text-xs tw:text-stone-500">
                      {spot.craftLabel}
                    </p>
                    <span className="tw:mt-2 tw:w-fit tw:rounded-full tw:bg-stone-900 tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-amber-50">
                      {spot.price}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    close();
                  }}
                  aria-label="Close"
                  className="tw:absolute tw:right-2 tw:top-2 tw:flex tw:h-6 tw:w-6 tw:items-center tw:justify-center tw:rounded-full tw:text-base tw:leading-none tw:text-stone-400 tw:transition tw:hover:bg-stone-100"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}

        {/* Mobile bottom sheet — the single shared element for whichever
            hotspot is active. Rendered here, as a direct sibling of the
            (transformed) per-hotspot wrappers above rather than nested
            inside one, so `position: fixed` is contained by the real
            viewport and actually behaves like a full-width sheet. Always
            mounted (rather than conditionally, based on activeSpot) so
            the slide/fade transition has something to animate between. */}
        <div
          role="dialog"
          aria-hidden={!activeSpot}
          onClick={() =>
            activeSpot && navigate(`/description/${activeSpot.id}`)
          }
          className={[
            "tw:sm:hidden tw:fixed tw:inset-x-4 tw:z-20 tw:rounded-xl tw:bg-white tw:p-4 tw:shadow-2xl tw:shadow-stone-900/20 tw:ring-1 tw:ring-stone-900/5 tw:transition-all tw:duration-200 tw:cursor-pointer",
            "tw:bottom-[max(1rem,env(safe-area-inset-bottom))]",
            activeSpot
              ? "tw:visible tw:translate-y-0 tw:opacity-100"
              : "tw:invisible tw:translate-y-4 tw:opacity-0",
          ].join(" ")}
        >
          {activeSpot && (
            <>
              <div className="tw:flex tw:gap-3">
                <img
                  src={activeSpot.image}
                  alt={activeSpot.name}
                  className="tw:h-16 tw:w-16 tw:flex-none tw:rounded-lg tw:object-cover"
                />
                <div className="tw:flex tw:min-w-0 tw:flex-col tw:justify-center">
                  <p className="tw:truncate tw:text-sm tw:font-medium tw:text-stone-900">
                    {activeSpot.name}
                  </p>
                  <p className="tw:mt-0.5 tw:truncate tw:text-xs tw:text-stone-500">
                    {activeSpot.craftLabel}
                  </p>
                  <span className="tw:mt-2 tw:w-fit tw:rounded-full tw:bg-stone-900 tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-amber-50">
                    {activeSpot.price}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  close();
                }}
                aria-label="Close"
                className="tw:absolute tw:right-2 tw:top-2 tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:text-lg tw:leading-none tw:text-stone-400 tw:transition tw:hover:bg-stone-100"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
