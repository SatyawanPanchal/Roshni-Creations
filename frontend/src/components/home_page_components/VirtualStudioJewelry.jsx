/**
 * VirtualStudioJewelry.jsx
 *
 * Tech: React + Tailwind CSS v4 (prefixed utilities, e.g. `tw:flex`) + PrimeReact
 *
 * Setup notes (one-time, in your app):
 * 1. npm install primereact primeicons
 * 2. Import once globally (e.g. in main.jsx / App.jsx):
 *      import "primereact/resources/themes/lara-light-green/theme.css";
 *      import "primereact/resources/primereact.min.css";
 *      import "primeicons/primeicons.css";
 * 3. In your Tailwind v4 CSS entry file:
 *      @import "tailwindcss" prefix(tw);
 * 4. Swap the placeholder image URLs below for your real product photography.
 */

import { useState } from "react";
import { Button } from "primereact/button";

import img1 from "../../images/VirtualStudio/img1.webp";
import img2 from "../../images/VirtualStudio/img2.webp";
import img3 from "../../images/VirtualStudio/img3.webp";
import img4 from "../../images/VirtualStudio/img4.webp";
import img5 from "../../images/VirtualStudio/img5.webp";
import img6 from "../../images/VirtualStudio/img6.webp";

import MODEL_IMG from "../../images/VirtualStudio/MODEL_IMAGE.webp";

const MODEL_IMAGE = MODEL_IMG;

const PIECES = [
  {
    id: "bridal-set",
    name: "Pink Fabric Necklace Set",
    image: img1,
  },
  {
    id: "temple-mangalsutra",
    name: "Temple Moon Mangalsutra",
    image: img2,
  },
  {
    id: "jhumka-earrings",
    name: "Gold Jhumka Earrings",
    image: img3,
  },
  {
    id: "layered-necklace",
    name: "Layered Kundan Necklace Set",
    image: img4,
  },
  {
    id: "pendant-chain",
    name: "Pendant Mangalsutra",
    image: img5,
  },
  {
    id: "chandbali",
    name: "Chandbali Danglers",
    image: img6,
  },
];

export default function VirtualStudioJewelry() {
  const [selectedId, setSelectedId] = useState(PIECES[0].id);
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section className="tw:hidden tw:sm:flex tw:relative tw:min-h-screen tw:w-full tw:bg-[#f4efe6] tw:items-center tw:justify-center tw:p-4 tw:sm:p-8 tw:lg:p-12">
      <div className="tw:relative tw:w-full tw:max-w-5xl">
        {/* soft offset backing card, echoes the layered look in the reference */}
        <div className="tw:hidden tw:sm:block tw:absolute tw:-top-4 tw:-left-4 tw:right-10 tw:h-16 tw:bg-[#e9e1d2] tw:rounded-2xl" />

        <div className="tw:relative tw:bg-transparent tw:grid tw:grid-cols-1 tw:lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] tw:gap-10 tw:lg:gap-16 tw:items-center">
          {/* ---------------- Left: photo / virtual try-on panel ---------------- */}
          <div className="tw:relative tw:mx-auto tw:w-full tw:max-w-md tw:lg:max-w-none">
            <div className="tw:relative tw:rounded-xl tw:overflow-hidden tw:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] tw:bg-white tw:aspect-[4/5]">
              <img
                src={MODEL_IMAGE}
                alt="Model wearing a bridal jewelry set for virtual try-on"
                className="tw:h-full tw:w-full tw:object-cover"
              />

              {/* face-detection style frame with a smooth scanning sweep */}
              <div className="vsj-frame tw:absolute tw:left-[22%] tw:right-[22%] tw:top-[28%] tw:bottom-[38%] tw:border tw:border-amber-300/70 tw:rounded-sm tw:pointer-events-none">
                <span className="vsj-scanline" />
              </div>

              {/* camera / capture trigger */}
              <div className="tw:absolute tw:bottom-5 tw:left-1/2 tw:-translate-x-1/2">
                <Button
                  rounded
                  aria-label="Open camera for live try-on"
                  icon="pi pi-camera"
                  onClick={() => setShowComingSoon(true)}
                  className="tw:!w-12 tw:!h-12 tw:!bg-amber-400/90 tw:!border-none tw:!text-[#3a2c17] tw:shadow-lg tw:font-bold tw:transition-transform tw:duration-300 tw:hover:scale-105 tw:hover:!bg-amber-400 tw:focus-visible:!outline tw:focus-visible:!outline-2 tw:focus-visible:!outline-offset-2 tw:focus-visible:!outline-amber-500"
                />
              </div>
            </div>
          </div>

          {/* ---------------- Right: selection panel ---------------- */}
          <div className="tw:w-full tw:max-w-md tw:mx-auto tw:lg:mx-0 tw:lg:max-w-none">
            <p className="tw:text-xs tw:tracking-[0.2em] tw:uppercase tw:text-amber-700/80 tw:font-medium">
              Virtual Studio
            </p>

            <h1 className="tw:mt-3 tw:font-serif tw:text-4xl tw:sm:text-5xl tw:leading-[1.05] tw:text-[#241f16]">
              Choose Your
              <br />
              <span className="tw:italic tw:font-serif">Piece</span>
            </h1>

            <p className="tw:mt-4 tw:text-[15px] tw:leading-relaxed tw:text-[#5c5346] tw:max-w-sm">
              Select a piece from our collection to see it come to life on you
              instantly.
            </p>

            {/* thumbnail grid */}
            <div
              role="listbox"
              aria-label="Choose a jewelry piece"
              className="tw:mt-6 tw:grid tw:grid-cols-3 tw:gap-3 tw:sm:gap-4"
            >
              {PIECES.map((piece) => {
                const isSelected = piece.id === selectedId;
                return (
                  <button
                    key={piece.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedId(piece.id)}
                    className={[
                      "tw:group tw:relative tw:aspect-square tw:rounded-lg tw:overflow-hidden tw:bg-[#efe8da]",
                      "tw:transition-all tw:duration-300 tw:ease-out",
                      "tw:ring-offset-2 tw:ring-offset-[#f4efe6] tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-amber-500",
                      isSelected
                        ? "tw:ring-2 tw:ring-[#8a6d2f] tw:scale-[1.02] tw:shadow-md"
                        : "tw:ring-1 tw:ring-black/5 tw:hover:ring-black/15 tw:hover:scale-[1.02]",
                    ].join(" ")}
                  >
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-300 tw:group-hover:scale-105"
                    />
                    {isSelected && (
                      <span className="tw:absolute tw:top-1.5 tw:right-1.5 tw:h-5 tw:w-5 tw:rounded-full tw:bg-[#1f3d2b] tw:text-white tw:flex tw:items-center tw:justify-center tw:text-[10px]">
                        <i className="pi pi-check" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <Button
              label="Start Virtual Session"
              onClick={() => setShowComingSoon(true)}
              className="tw:!w-full tw:!mt-8 tw:!bg-[#1f3d2b] tw:!border-none tw:!py-3.5 tw:!text-sm tw:!tracking-[0.15em] tw:!uppercase tw:!rounded-md tw:transition-colors tw:duration-300 tw:hover:!bg-[#183120]"
            />
          </div>
        </div>
      </div>

      {/* ---------------- Coming Soon overlay ---------------- */}
      {showComingSoon && (
        <div
          className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:bg-black/30 tw:backdrop-blur-[2px] tw:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Feature coming soon"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
      vsj-pop
      tw:relative
      tw:w-50
      tw:max-w-80
      tw:overflow-hidden
      tw:rounded-2xl
      tw:bg-[#fbf8f2]
      tw:px-7
      tw:py-8
      tw:text-center
      tw:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]
      tw:ring-1
      tw:ring-black/5
      tw:sm:px-9
      tw:sm:py-9
    "
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowComingSoon(false)}
              className="
        tw:absolute
        tw:right-3
        tw:top-3
        tw:flex
        tw:h-8
        tw:w-8
        tw:items-center
        tw:justify-center
        tw:rounded-full
        tw:text-[#8a7d63]
        tw:transition-all
        tw:duration-200
        tw:hover:bg-black/5
        tw:hover:text-[#241f16]
        tw:focus-visible:outline-none
        tw:focus-visible:ring-2
        tw:focus-visible:ring-amber-500
      "
            >
              <i className="pi pi-times tw:text-xs" />
            </button>

            {/* Icon */}
            <div
              className="
        tw:mx-auto
        tw:flex
        tw:h-14
        tw:w-14
        tw:items-center
        tw:justify-center
        tw:rounded-full
        tw:bg-amber-400/20
      "
            >
              <i className="pi pi-clock tw:text-xl tw:text-amber-700" />
            </div>

            {/* Content */}
            <div className="tw:mt-5">
              <h2
                className="
          tw:m-0
          tw:font-serif
          tw:text-2xl
          tw:font-semibold
          tw:leading-tight
          tw:text-[#241f16]
        "
              >
                Coming soon
              </h2>

              <p
                className="
          tw:mx-auto
          tw:mt-3
          tw:max-w-[290px]
          tw:text-sm
          tw:leading-6
          tw:text-[#5c5346]
        "
              >
                Virtual try-on is on its way. Check back shortly.
              </p>
            </div>

            {/* Button */}
            <Button
              label="Got it"
              onClick={() => setShowComingSoon(false)}
              className="
        tw:!mt-6
        tw:!h-11
        tw:!w-full
        tw:!rounded-lg
        tw:!border-none
        tw:!bg-[#1f3d2b]
        tw:!px-4
        tw:!py-0
        tw:!text-sm
        tw:!font-medium
        tw:!text-white
        tw:transition-all
        tw:duration-300
        tw:hover:!bg-[#183120]
        tw:hover:!shadow-md
        tw:active:!scale-[0.98]
      "
            />
          </div>
        </div>
      )}

      {/* scoped keyframes for the smooth scanning sweep on the photo frame + overlay pop-in */}
      <style>{`
        .vsj-frame { overflow: hidden; }
        .vsj-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(217, 119, 6, 0) 0%,
            rgba(217, 119, 6, 0.9) 50%,
            rgba(217, 119, 6, 0) 100%
          );
          animation: vsj-sweep 3.2s ease-in-out infinite;
        }
        @keyframes vsj-sweep {
          0% { top: 4%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 92%; opacity: 1; }
          60% { opacity: 0; }
          100% { top: 4%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsj-scanline { animation: none; opacity: 0; }
        }

        .vsj-pop {
          animation: vsj-pop-in 0.22s ease-out;
        }
        @keyframes vsj-pop-in {
          0% { opacity: 0; transform: scale(0.94) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsj-pop { animation: none; }
        }
      `}</style>
    </section>
  );
}
