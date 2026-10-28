/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import hero from "../images/AboutPage/aboutHero.webp";
import founder from "../images/AboutPage/aboutCreator.webp";
import handmade from "../images/AboutPage/aboutHandmade.webp";
import curated from "../images/AboutPage/curated.webp";
import custom from "../images/AboutPage/custom.webp";
import green from "../images/AboutPage/green.webp";
import mint from "../images/AboutPage/mint.webp";
import pink from "../images/AboutPage/pink.webp";
import creating from "../images/AboutPage/creating.webp";
import letter from "../images/AboutPage/letter.webp";
import packing from "../images/AboutPage/packing.webp";
import checking from "../images/AboutPage/checking.webp";
import { useNavigate } from "react-router-dom";

/* ---------------- Fonts ---------------- */
const serif =
  "tw:font-['Cormorant_Garamond',serif] tw:font-medium tw:text-[#086B63] tw:leading-[1.08]";
const hand = "tw:font-['Mrs_Saint_Delafield',cursive]";

/* ---------------- Content (easy to edit) ---------------- */
const steps = [
  {
    title: "Handmade & Curated Jewellery",
    text: "We source or create pieces with care.",
    img: creating,
  },
  {
    title: "Jewellery Quality Check",
    text: "Each piece is quality checked before packing.",
    img: checking,
  },
  {
    title: "Secure Jewellery Packaging",
    text: "Thoughtfully packed, ready for your moments.",
    img: packing,
  },
  {
    title: "Packed with Care & Love",
    text: "Because every order means something to us.",
    img: letter,
  },
];

// Colour examples (illustrative only)
const colours = [
  { name: "Emerald green", hex: "#0b5a3c", img: green },
  { name: "Rose pink", hex: "#eea6b8", img: pink },
  { name: "Soft mint", hex: "#8fd6bf", img: mint },
];

// SAMPLE reviews — replace with real customer reviews
const reviews = [
  {
    name: "Neha S.",
    img: "/images/customer-1.jpg",
    text: "Absolutely loved the earrings! They are even more beautiful in person. The packaging was so thoughtful and elegant.",
  },
  {
    name: "Riya M.",
    img: "/images/customer-2.jpg",
    text: "The quality and detailing are beautiful. I’ve worn my piece for both a family function and a casual outing, and it still looks as good as new.",
  },
  {
    name: "Ananya T.",
    img: "/images/customer-3.jpg",
    text: "Such unique designs! I love how each piece feels special. Will definitely be shopping again.",
  },
];

/* ---------------- Small reusable pieces ---------------- */

// Gold botanical line drawing
function Leaf({ className }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M20 138C28 100 40 60 62 6" />
      <path d="M30 108c-12-4-20-14-20-26 12 2 20 10 20 26zM34 90c12-2 22-12 24-24-12 0-22 10-24 24zM40 68c-11-3-19-12-20-24 11 1 19 9 20 24zM46 52c10-3 18-12 20-22-11 0-19 8-20 22zM54 30c-8-2-14-10-14-18 9 1 14 8 14 18z" />
    </svg>
  );
}

// Small icons for the Handmade / Curated cards and the customisation note
const FlowerIcon = () => (
  <svg
    viewBox="0 0 40 40"
    className="tw:h-[34px] tw:w-[34px] tw:shrink-0 tw:text-[#C6A15B]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
  >
    <circle cx="20" cy="20" r="3" />
    <ellipse cx="20" cy="11" rx="3.6" ry="6" />
    <ellipse cx="20" cy="29" rx="3.6" ry="6" />
    <ellipse cx="11" cy="20" rx="6" ry="3.6" />
    <ellipse cx="29" cy="20" rx="6" ry="3.6" />
    <ellipse
      cx="13.6"
      cy="13.6"
      rx="3.4"
      ry="5.4"
      transform="rotate(-45 13.6 13.6)"
    />
    <ellipse
      cx="26.4"
      cy="26.4"
      rx="3.4"
      ry="5.4"
      transform="rotate(-45 26.4 26.4)"
    />
    <ellipse
      cx="26.4"
      cy="13.6"
      rx="3.4"
      ry="5.4"
      transform="rotate(45 26.4 13.6)"
    />
    <ellipse
      cx="13.6"
      cy="26.4"
      rx="3.4"
      ry="5.4"
      transform="rotate(45 13.6 26.4)"
    />
  </svg>
);
const GemIcon = () => (
  <svg
    viewBox="0 0 40 40"
    className="tw:h-[34px] tw:w-[34px] tw:shrink-0 tw:text-[#C6A15B]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    strokeLinejoin="round"
  >
    <path d="M8 14l4-6h8l4 6-8 12z" />
    <path d="M8 14h16M14 8l2 6 2 12M20 8l-2 6" />
    <circle cx="29" cy="26" r="5" />
    <path d="M26 26h6M29 23v6" />
  </svg>
);
const NoteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="tw:h-6 tw:w-6 tw:shrink-0 tw:text-[#C6A15B]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2M8.5 15.5c1 1 2.2 1.5 3.5 1.5" />
  </svg>
);

// Small uppercase label with a gold line in front
function Eyebrow({ children, gold, small }) {
  return (
    <p
      className={`tw:flex tw:items-center tw:gap-3 tw:uppercase tw:font-medium ${small ? "tw:text-[10px]" : "tw:text-[11px]"} tw:tracking-[0.2em] ${gold ? "tw:text-[#C6A15B]" : "tw:text-[#086B63]"}`}
    >
      <span className="tw:h-px tw:w-[34px] tw:shrink-0 tw:bg-[#C6A15B]" />
      {children}
    </p>
  );
}

// Heading on the left + short text with a thin divider on the right
function SectionHead({ eyebrow, title, text }) {
  return (
    <div className="tw:mb-6 tw:grid tw:items-center tw:gap-3 tw:md:grid-cols-2 tw:md:gap-16">
      <div>
        <Eyebrow small>{eyebrow}</Eyebrow>
        <h2 className={`${serif} tw:mt-2 tw:text-[2rem] tw:md:text-[2.75rem]`}>
          {title}
        </h2>
      </div>
      <p className="tw:max-w-[46ch] tw:text-[13.5px] tw:font-light tw:text-[#5d6a66] tw:md:border-l tw:md:border-[#E6DDC8] tw:md:pl-6">
        {text}
      </p>
    </div>
  );
}

// Green button used on the page
const greenBtn =
  "tw:rounded! tw:border-[#086B63]! tw:bg-[#086B63]! tw:px-6! tw:py-3! tw:text-[13px]! tw:font-medium! tw:tracking-wide! tw:text-white! tw:gap-3! tw:font-['Jost',sans-serif]!";

/* ================================================================== */
export default function AboutPage() {
  const [colour, setColour] = useState(colours[0]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="tw:overflow-x-hidden tw:bg-[#F8F5EF] tw:font-['Jost',sans-serif] tw:text-[15px] tw:leading-relaxed tw:text-[#24302D]">
      {/* ============ 1. HERO ============ */}
      <section className="tw:mx-auto tw:max-w-[1200px] tw:px-4 tw:py-10 tw:md:py-14">
        <div className="tw:grid tw:items-center tw:gap-8 tw:md:grid-cols-[0.82fr_1.12fr] tw:lg:grid-cols-[1fr_1.12fr_0.2fr] tw:lg:gap-11">
          {/* text */}
          <div className="tw:order-2 tw:md:order-1">
            <Eyebrow>About Roshni Creations</Eyebrow>
            <h1
              className={`${serif} tw:mt-4 tw:mb-5 tw:max-w-[9.5em] tw:text-[2.6rem] tw:md:text-[3.6rem]`}
            >
              Handmade & Curated Jewellery for Every Special Moment
            </h1>
            <p className="tw:mb-6 tw:max-w-[34ch] tw:text-[15px] tw:font-light">
              Discover Roshni Creations, where handcrafted artistry meets
              thoughtfully curated jewellery designs for everyday elegance and
              special occasions.
            </p>
            <Button
              label="Discover Our Story"
              icon="pi pi-arrow-right"
              iconPos="right"
              className={greenBtn}
              onClick={() =>
                document
                  .getElementById("story")
                  .scrollIntoView({ behavior: "smooth" })
              }
            />
            {/* thin gold rule + leaf */}
            <div className="tw:mt-4 tw:flex tw:max-w-[360px] tw:items-end">
              <span className="tw:mb-5 tw:h-px tw:flex-1 tw:bg-[#E4D3AE]" />
              <Leaf className="tw:h-[70px] tw:w-14 tw:shrink-0 tw:text-[#C6A15B]" />
            </div>
          </div>

          {/* image with gold offset frame */}
          <div className="tw:relative tw:order-1 tw:ml-9 tw:aspect-[0.92/1] tw:md:order-2 tw:md:ml-6">
            <span className="tw:absolute tw:-left-9 tw:top-0 tw:-bottom-1.5 tw:w-[42%] tw:border tw:border-r-0 tw:border-[#C6A15B]" />
            <img
              src={hero}
              alt="Roshni Creations jewellery"
              className="tw:relative tw:h-full tw:w-full tw:rounded-tr-[90px] tw:object-cover tw:shadow-[0_18px_40px_-26px_rgba(36,48,45,0.45)] tw:md:rounded-tr-[130px]"
            />
          </div>

          {/* handwritten note */}
          <p
            className={`${hand} tw:order-3 tw:text-[1.9rem] tw:lg:text-[2.3rem] tw:leading-[1.05] tw:text-[#6b6a5a] tw:lg:-rotate-[8deg] tw:md:col-span-2 tw:md:text-right tw:lg:col-span-1 tw:lg:text-left`}
          >
            Thoughtfully chosen. Beautifully yours.
          </p>
        </div>
      </section>

      {/* ============ 2. FOUNDER STORY ============ */}
      <section
        id="story"
        className="tw:mx-auto tw:mb-16 tw:w-[calc(100%-1rem)] tw:max-w-[1280px]"
      >
        <div className="tw:relative tw:grid tw:items-center tw:gap-8 tw:overflow-hidden tw:rounded-md tw:bg-[#F1EBDD] tw:px-6 tw:py-8 tw:md:grid-cols-[0.78fr_1.22fr] tw:md:gap-16 tw:md:px-14 tw:md:py-8 tw:md:pl-8">
          {/* portrait with arch top + leaf */}
          <div className="tw:relative tw:mx-auto tw:aspect-[0.78/1] tw:w-full tw:max-w-[300px] tw:md:max-w-[330px]">
            <img
              src={founder}
              alt="Founder of Roshni Creations"
              className="tw:h-full tw:w-full tw:rounded-t-full tw:object-cover"
            />
            <Leaf className="tw:absolute tw:-right-6 tw:bottom-[-4px] tw:z-10 tw:h-[150px] tw:w-[110px] tw:text-[#C6A15B] tw:md:-right-12" />
          </div>

          <div className="tw:relative tw:z-10 tw:max-w-[520px]">
            <Eyebrow small>Our Story</Eyebrow>
            <h2
              className={`${serif} tw:mt-3 tw:mb-5 tw:text-[2.1rem] tw:md:text-5xl`}
            >
              Handmade Jewellery Crafted with Love.
            </h2>
            {/* PLACEHOLDER COPY — replace with Roshni's own words */}
            <p className="tw:mb-4 tw:text-[15px] tw:font-light tw:text-[#34413d]">
              Roshni Creations is a handmade jewellery brand offering unique
              kundan, pearl, resin, and beaded jewellery. From lightweight daily
              wear jewellery to elegant festive designs, every piece is
              thoughtfully crafted or curated to blend traditional beauty with
              modern style.
            </p>
            <p className="tw:mb-4 tw:text-[15px] tw:font-light tw:text-[#34413d]">
              As a women-led creative brand, we celebrate the beauty of
              handcrafted jewellery, meaningful designs, and the artistry behind
              every piece.
            </p>
            <p className={`${hand} tw:mt-2 tw:text-[2.6rem] tw:leading-none`}>
              Ms. Poonam Panchal
            </p>
            <p className="tw:mt-1 tw:text-[10px] tw:uppercase tw:tracking-[0.17em] tw:text-[#5d6a66]">
              Founder, Roshni Creations
            </p>
          </div>

          {/* soft decorative half circle on the right */}
          <span className="tw:pointer-events-none tw:absolute tw:-right-[90px] tw:top-1/2 tw:hidden tw:h-[260px] tw:w-[190px] tw:-translate-y-[35%] tw:rounded-l-full tw:bg-[#ece3cf] tw:opacity-80 tw:md:block" />
        </div>
      </section>

      {/* ============ 3. TWO WAYS, ONE VISION ============ */}
      <section className="tw:mx-auto tw:mb-16 tw:max-w-[1200px] tw:px-4">
        <SectionHead
          eyebrow="Handmade & thoughtfully curated"
          title="Two ways, one vision."
          text="Discover unique jewellery designs, from lightweight everyday styles to elegant festive pieces."
        />

        <div className="tw:grid tw:gap-5 tw:md:grid-cols-2">
          {/* Handmade */}
          <article className="tw:grid tw:min-h-[230px] tw:grid-cols-[0.9fr_1.2fr]">
            <div className="tw:relative tw:min-h-[230px]">
              <img
                src={handmade}
                alt="Handmade jewellery"
                className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
              />
            </div>
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-2.5 tw:border tw:border-l-0 tw:border-[#E6DDC8] tw:bg-[#F1EBDD] tw:p-5 tw:md:p-7">
              <div className="tw:flex tw:items-start tw:gap-3.5 tw:text-[11px] tw:font-medium tw:uppercase tw:leading-[1.7] tw:tracking-[0.26em] tw:text-[#086B63]">
                <FlowerIcon />
                <span>
                  Handmade
                  <br />
                  Pieces
                </span>
              </div>
              <p className="tw:text-[13.5px] tw:font-light tw:text-[#34413d]">
                Our handmade range includes resin, kundan, pearl and beaded
                designs, crafted with patience and a lot of love.
              </p>
              {/* TODO: link to the handmade collection */}
              <a
                onClick={() => navigate("/products")}
                className="tw:mt-auto tw:text-sm tw:font-medium tw:text-[#086B63] tw:cursor-pointer"
              >
                Explore Handmade →
              </a>
            </div>
          </article>

          {/* Curated */}
          <article className="tw:grid tw:min-h-[230px] tw:grid-cols-[0.9fr_1.2fr]">
            <div className="tw:relative tw:min-h-[230px]">
              <img
                src={curated}
                alt="Curated jewellery"
                className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
              />
            </div>
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-2.5 tw:border tw:border-l-0 tw:border-[#E6DDC8] tw:bg-[#F1EBDD] tw:p-5 tw:md:p-7">
              <div className="tw:flex tw:items-start tw:gap-3.5 tw:text-[11px] tw:font-medium tw:uppercase tw:leading-[1.7] tw:tracking-[0.26em] tw:text-[#086B63]">
                <GemIcon />
                <span>
                  Curated
                  <br />
                  Pieces
                </span>
              </div>
              <p className="tw:text-[13.5px] tw:font-light tw:text-[#34413d]">
                We also source beautiful pieces from artisans and creators we
                trust, choosing only what fits our style and standards.
              </p>
              {/* TODO: link to the curated collection */}
              <a
                onClick={() => navigate("/products")}
                className="tw:mt-auto tw:text-sm tw:font-medium tw:text-[#086B63] tw:cursor-pointer"
              >
                Explore Curated →
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ============ 4. FROM OUR HANDS TO YOURS ============ */}
      <section className="tw:mx-auto tw:mb-16 tw:max-w-[1200px] tw:px-4">
        <SectionHead
          eyebrow="OUR JEWELLERY PROCESS"
          title="From Handmade Jewellery to Your Doorstep"
          text="Discover how we carefully craft and curate unique handmade jewellery, check every detail for quality, and thoughtfully package each order for a beautiful unboxing experience."
        />

        <ol className="tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-8 tw:lg:grid-cols-4 tw:lg:gap-x-11">
          {steps.map((step, i) => (
            <li key={step.title} className="tw:relative">
              <img
                src={step.img}
                alt={step.title}
                className="tw:aspect-[1.6/1] tw:w-full tw:rounded-[3px] tw:object-cover"
              />
              {/* numbered circle sitting on the image edge */}
              <span className="tw:relative tw:z-10 tw:-mt-3.5 tw:mb-2 tw:ml-1.5 tw:flex tw:h-[30px] tw:w-[30px] tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-[#086B63] tw:bg-[#F8F5EF] tw:font-['Cormorant_Garamond',serif] tw:font-semibold tw:text-[#086B63]">
                {i + 1}
              </span>
              <h3 className="tw:mb-1 tw:text-[15px] tw:font-medium tw:text-[#086B63]">
                {step.title}
              </h3>
              <p className="tw:max-w-[22ch] tw:text-[12.5px] tw:font-light tw:leading-snug tw:text-[#5d6a66]">
                {step.text}
              </p>

              {/* thin divider + small gold arrow between steps (desktop only) */}
              {i < steps.length - 1 && (
                <>
                  <span className="tw:absolute tw:-right-[22px] tw:top-0 tw:bottom-0 tw:hidden tw:border-r tw:border-[#E6DDC8] tw:lg:block" />
                  <span className="tw:absolute tw:-right-[26px] tw:top-[76px] tw:hidden tw:h-2 tw:w-2 tw:rotate-45 tw:border-t tw:border-r tw:border-[#C6A15B] tw:bg-[#F8F5EF] tw:lg:block" />
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ============ 5. MAKE IT YOURS ============ */}
      <section
        id="customisation"
        className="tw:mx-auto tw:mb-12 tw:max-w-[1200px] tw:px-4"
      >
        <div className="tw:grid tw:min-h-[240px] tw:border tw:border-[#E6DDC8] tw:bg-[#F1EBDD] tw:md:grid-cols-[1.05fr_1.25fr] tw:lg:grid-cols-[1.05fr_1.25fr_0.9fr]">
          <div className="tw:relative tw:min-h-[220px]">
            <img
              src={custom}
              alt="Jewellery set"
              className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
            />
          </div>

          <div className="tw:flex tw:flex-col tw:justify-center tw:gap-2.5 tw:px-5 tw:py-6 tw:md:px-8">
            <p className="tw:flex tw:items-center tw:gap-2 tw:text-[10px] tw:font-medium tw:uppercase tw:tracking-[0.2em] tw:text-[#C6A15B]">
              <span className="tw:h-px tw:w-2 tw:bg-[#C6A15B]" />
              Jewellery Customisation
            </p>
            <h2 className={`${serif} tw:text-[1.8rem] tw:md:text-[2.2rem]`}>
              Make It Yours, Make It Festive
            </h2>
            <p className="tw:max-w-[44ch] tw:text-[13.5px] tw:font-light tw:text-[#34413d]">
              Looking for customised festive jewellery? Personalise select
              kundan, pearl, and statement jewellery designs with your preferred
              colours and details to complement your festive outfits.
            </p>
            <div className="tw:my-1.5 tw:flex tw:items-start tw:gap-3 tw:text-[12.5px] tw:font-light tw:text-[#5d6a66]">
              <NoteIcon />
              <span>
                Share your ideas with us, and we’ll help you explore what’s
                possible.
              </span>
            </div>
            <Button
              label="Enquire Now"
              icon="pi pi-arrow-right"
              iconPos="right"
              className={`${greenBtn} tw:self-start`}
              onClick={() => {
                const phoneNumber = "918053789088";
                const message =
                  "Hi, I would like to enquire about your products.";
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              }}
            />
          </div>

          {/* Example — click a colour to change the photo */}
          <aside className="tw:mx-5 tw:mb-5 tw:flex tw:flex-col tw:gap-3 tw:border-t tw:border-[#C6A15B] tw:pt-5 tw:md:col-span-2 tw:lg:col-span-1 tw:lg:my-6 tw:lg:ml-0 tw:lg:border-l tw:lg:border-t-0 tw:lg:px-6 tw:lg:pt-0">
            <h3 className="tw:text-[13px] tw:font-medium">
              Your Style, Your Colours
            </h3>
            <div className="tw:grid tw:grid-cols-[76px_1fr] tw:items-center tw:gap-3.5">
              <img
                src={colour.img}
                alt={colour.name}
                className="tw:aspect-[0.8/1] tw:w-full tw:object-cover"
              />
              <div>
                <p className="tw:mb-1 tw:text-[11px] tw:font-light tw:leading-snug tw:text-[#5d6a66]">
                  Choose your preferred stone colours and bead combinations for
                  a look that feels uniquely yours.
                </p>
                <p className="tw:mb-2.5 tw:text-[11px] tw:font-medium tw:text-[#086B63]">
                  Shown: {colour.name}
                </p>
                <div className="tw:flex tw:gap-1.5">
                  {colours.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      aria-label={c.name}
                      onClick={() => setColour(c)}
                      style={{ background: c.hex }}
                      className={`tw:h-[22px] tw:w-[22px] tw:cursor-pointer tw:rounded-full tw:border-2 tw:border-[#F1EBDD] ${colour.name === c.name ? "tw:ring-[1.5px] tw:ring-[#086B63]" : "tw:ring-1 tw:ring-[#E6DDC8]"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ 6. LOVED BY YOU ============ */}
      {/* <section className="tw:mx-auto tw:mb-14 tw:max-w-[1200px] tw:px-4">
        <div className="tw:mb-5 tw:flex tw:items-end tw:justify-between tw:gap-5">
          <div>
            <p className="tw:mb-1.5 tw:text-[10px] tw:font-medium tw:uppercase tw:tracking-[0.2em] tw:text-[#C6A15B]">
              Kind words
            </p>
            <h2 className={`${serif} tw:text-[2rem] tw:md:text-[2.75rem]`}>
              Loved by you.
            </h2>
          </div>
          
          <a
            href="/reviews"
            className="tw:text-xs tw:font-medium tw:text-[#086B63]"
          >
            Read more reviews →
          </a>
        </div>

        <div className="tw:grid tw:gap-4 tw:md:grid-cols-3 tw:lg:gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="tw:m-0 tw:grid tw:grid-cols-[64px_1fr] tw:gap-3.5 tw:border tw:border-[#E6DDC8] tw:bg-[#F1EBDD] tw:p-4"
            >
              <img
                src={r.img}
                alt={r.name}
                className="tw:h-16 tw:w-16 tw:rounded-full tw:object-cover"
              />
              <div>
                <blockquote className="tw:m-0 tw:text-[13px] tw:font-light tw:leading-relaxed tw:text-[#34413d]">
                  “{r.text}”
                </blockquote>
                <figcaption className="tw:mt-2.5 tw:text-[11px] tw:text-[#5d6a66]">
                  — {r.name} <em>(sample)</em>
                </figcaption>
                <Rating
                  value={5}
                  readOnly
                  cancel={false}
                  pt={{
                    onIcon: { className: "tw:h-3! tw:w-3! tw:text-[#C6A15B]!" },
                  }}
                  className="tw:mt-1.5"
                />
              </div>
            </figure>
          ))}
        </div>
        <p className="tw:mt-3 tw:text-xs tw:italic tw:text-[#5d6a66]">
          Sample reviews for layout only — replace with verified customer
          reviews.
        </p>
      </section> */}

      {/* ============ 7. CLOSING BANNER ============ */}
      <section className="tw:relative tw:overflow-hidden tw:bg-gradient-to-b tw:from-[#0a5b54] tw:to-[#06453f] tw:px-4 tw:py-14 tw:text-center tw:text-white tw:md:py-[70px]">
        <Leaf className="tw:absolute tw:-bottom-2 tw:left-0 tw:w-[clamp(90px,14vw,170px)] tw:text-[#C6A15B] tw:opacity-60 tw:md:opacity-90" />
        <Leaf className="tw:absolute tw:-bottom-2 tw:right-0 tw:w-[clamp(90px,14vw,170px)] tw:-scale-x-100 tw:text-[#C6A15B] tw:opacity-60 tw:md:opacity-90" />
        <div className="tw:relative tw:z-10">
          <span className="tw:mx-auto tw:mb-5 tw:block tw:h-px tw:w-[26px] tw:bg-[#C6A15B]" />
          <h2 className="tw:mb-2.5 tw:font-['Cormorant_Garamond',serif] tw:text-[1.9rem] tw:font-medium tw:md:text-[2.5rem]">
            Find the piece that feels like you.
          </h2>
          <p className="tw:mb-6 tw:text-sm tw:font-light tw:text-[#d6e4e1]">
            Explore our handcrafted and curated jewellery collection.
          </p>
          {/* TODO: link to all collections */}
          <Button
            label="Explore Our Collections"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="tw:rounded! tw:border-[#C6A15B]! tw:bg-[#C6A15B]! tw:px-6! tw:py-3! tw:text-[13px]! tw:font-medium! tw:text-[#06453f]! tw:gap-3! tw:font-['Jost',sans-serif]!"
            onClick={() => navigate("/products")}
          />
        </div>
      </section>

      {/* ============ ENQUIRY POPUP ============ */}
      {/* <Dialog
        header="Customisation enquiry"
        visible={showForm}
        onHide={() => setShowForm(false)}
        style={{ width: "min(460px, 92vw)" }}
      >
        <form
          className="tw:flex tw:flex-col tw:gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: send the form to your backend / WhatsApp here
            setShowForm(false);
          }}
        >
          <InputText placeholder="Your name" required />
          <InputText placeholder="Email or phone" required />
          <InputTextarea
            rows={4}
            placeholder="Your idea — colour change, matching set, small design tweak…"
            required
          />
          <Button type="submit" label="Send enquiry" className={greenBtn} />
        </form>
      </Dialog> */}
    </div>
  );
}
