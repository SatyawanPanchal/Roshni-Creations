/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import HERO_IMAGE from "../images/jewellerycare/carehero.webp";
import beadthread from "../images/jewellerycare/beadthread.webp";
import fabric from "../images/jewellerycare/fabric.webp";
import mangalsutra from "../images/jewellerycare/mangalsutra.webp";
import kundan from "../images/jewellerycare/kundan.webp";
import metalPlated from "../images/jewellerycare/metalPlated.webp";
import pearl from "../images/jewellerycare/pearl.webp";
import resin from "../images/jewellerycare/resin.webp";
import watch from "../images/jewellerycare/watch.webp";
import POUCH_IMAGE from "../images/jewellerycare/pouch.jpg";

/* ------------------------------------------------------------------
   1. SETTINGS: change these
------------------------------------------------------------------ */

// Your WhatsApp number: digits only, with country code, e.g. "919876543210"
const WHATSAPP_NUMBER = "918053789088";

// Contact page link (replace with your real one)
// const CONTACT_URL = "/contact";

/* ------------------------------------------------------------------
   2. CONTENT
------------------------------------------------------------------ */

const MATERIALS = [
  {
    key: "kundan",
    label: "Kundan",
    title: "Kundan Jewellery",
    intro:
      "Kundan jewellery features decorative stones, intricate settings and detailed craftsmanship that deserve gentle care. Understanding how to handle and store these elements helps protect their appearance and reduces the risk of loosening stones or damaging delicate attachments.",
    image: kundan,
    after:
      "After wearing, gently wipe your kundan jewellery with a soft, dry cloth, avoiding pressure on stones and settings.",
    cleaning:
      "Avoid soaking, brushing or applying jewellery cleaners. Decorative stones and adhesives may require specialised care.",
    storage:
      "Store in a clean, dry, padded jewellery box or soft pouch, away from pieces that could scratch or loosen the stones.",
    avoid:
      "Avoid pulling at stones, soaking the piece or using chemicals and polishes without confirming they are suitable.",
    unsure:
      "Unsure how to clean your kundan jewellery? Share a photo with Roshni Creations for guidance.",
  },
  {
    key: "pearl",
    label: "Pearl",
    title: "Pearl Jewellery",
    intro:
      "Pearl jewellery can feature natural pearls, imitation pearls or pearl-like decorative elements, each with different care requirements. Gentle handling and suitable cleaning methods help protect their surface, lustre, finish and the threads or settings that hold the piece together.",
    image: pearl,
    after:
      "After wearing, gently wipe your pearl jewellery with a soft, dry cloth to remove surface oils and residue.",
    cleaning:
      "Natural pearls, imitation pearls and pearl-like decorations may need different care. Confirm the material before using liquids or cleaners.",
    storage:
      "Store pearl jewellery separately in a clean, dry, soft pouch to protect it from scratches and abrasion.",
    avoid:
      "Avoid soaking, abrasive cloths, harsh chemicals and unverified cleaning products that could damage pearl surfaces or finishes.",
    unsure:
      "Not sure what type of pearls your jewellery contains? Share a photo or order details before attempting to clean it.",
  },
  {
    key: "resin",
    label: "Resin",
    title: "Resin Jewellery",
    intro:
      "Resin jewellery is loved for its distinctive colours, glossy finishes and decorative elements, including embedded flowers or other designs. Proper resin jewellery care helps minimise scratches, cloudiness and heat-related damage while protecting any attached metal fittings or embellishments.",
    image: resin,
    after:
      "Gently wipe your resin jewellery with a clean, soft, dry cloth to remove fingerprints and everyday residue.",
    cleaning:
      "Avoid abrasive cleaners and solvents. Use liquids only when the cleaning method is confirmed suitable for the specific resin and attached components.",
    storage:
      "Store in a soft pouch in a cool, dry place away from direct sunlight, sharp objects and heavier jewellery.",
    avoid:
      "Avoid excessive heat, prolonged direct sunlight and harsh chemicals. Do not assume every resin piece is waterproof.",
    unsure:
      "Need help caring for your resin jewellery? Send Roshni Creations a photo of your piece for guidance.",
  },
  {
    key: "beads",
    label: "Beads & Threadwork",
    title: "Beaded Jewellery & Threadwork",
    intro:
      "Beaded jewellery and threadwork designs combine individual beads, delicate threads, knots and decorative details that can be affected by pulling, friction or moisture. Careful handling and appropriate storage help preserve the arrangement, colour and structure of these handcrafted pieces.",
    image: beadthread,
    after:
      "After wearing, gently remove surface dust with a soft, dry cloth without pulling on threads, knots or attached beads.",
    cleaning:
      "Avoid soaking and unverified cleaning products, as beads, dyes, threads and adhesives may react differently to moisture.",
    storage:
      "Store flat or loosely arranged in a soft pouch, keeping the piece separate from jewellery that could snag or scratch it.",
    avoid:
      "Avoid pulling threads, stretching knots, rubbing delicate beads and exposing the piece to moisture without checking its care requirements.",
    unsure:
      "If a bead becomes loose or a thread starts to unravel, stop wearing the piece and contact Roshni Creations for advice.",
  },
  {
    key: "plated",
    label: "Plated Metal",
    title: "Plated Metal Jewellery",
    intro:
      "Plated metal jewellery features a decorative surface coating over a base metal, giving each piece its desired colour and finish. Everyday friction, moisture, perfumes and harsh chemicals can contribute to surface wear, so appropriate jewellery care helps maintain its appearance for longer.",
    image: metalPlated,
    after:
      "After wearing, gently wipe your plated jewellery with a soft, dry cloth to remove surface moisture, skin oils and residue.",
    cleaning:
      "Avoid abrasive polishing cloths, metal cleaners and chemical dips unless they are specifically confirmed as suitable for the plating.",
    storage:
      "Store each piece separately in a clean, dry pouch to minimise scratches and friction against other jewellery.",
    avoid:
      "Avoid unnecessary moisture, perfumes directly on the piece, harsh chemicals and vigorous rubbing. Plating may wear over time.",
    unsure:
      "If your plated jewellery changes colour or loses its shine, share a photo with us before trying a polishing treatment.",
  },
  {
    key: "fabric",
    label: "Fabric",
    title: "Fabric Jewellery",
    intro:
      "Fabric jewellery combines textiles, fibres, stitching, embroidery and sometimes beads or other embellishments to create distinctive designs. Different fabrics and dyes respond differently to moisture and cleaning products, making gentle handling and material-appropriate care essential for preserving the shape and detailing.",
    image: fabric,
    after:
      "After wearing, allow your fabric jewellery to air out in a dry place away from direct heat and moisture.",
    cleaning:
      "Check the fabric and attached decorations before cleaning. Avoid washing or treating stains until a suitable method is confirmed.",
    storage:
      "Store in a clean, dry pouch and support the piece so that embroidery, stitching and decorative elements are not crushed.",
    avoid:
      "Avoid soaking, vigorous rubbing, pulling stitches and storing fabric jewellery while damp.",
    unsure:
      "Unsure how to remove a stain from your fabric jewellery? Share a photo and ask us before attempting treatment.",
  },
  {
    key: "watches",
    label: "Watches",
    title: "Watch Care & Maintenance",
    intro:
      "Watches combine several components, including the case, dial, strap, finish and internal mechanism, each with specific care requirements. Following the manufacturer's instructions helps protect the watch's appearance and operation, while its verified water-resistance rating determines what kind of moisture exposure it can tolerate.",
    image: watch,
    after:
      "Gently wipe the watch case and strap with a soft, dry cloth, following the manufacturer's care instructions.",
    cleaning:
      "Check the manufacturer's guidance before using water or cleaning products. Seek a qualified watch professional for battery or internal repairs.",
    storage:
      "Store your watch in a clean, dry watch box or soft pouch, away from excessive heat and objects that could scratch it.",
    avoid:
      "Never assume a watch is waterproof. Avoid water exposure, chemicals and opening the case unless its specifications and care instructions permit it.",
    unsure:
      "Share your watch model or order details with Roshni Creations so we can help you identify the appropriate care guidance.",
  },
  {
    key: "mangalsutra",
    label: "Mangalsutra",
    title: "Mangalsutra Care",
    intro:
      "A mangalsutra may combine a chain, black beads, a pendant, decorative stones and plated or other metal components in a single design. Because these materials can have different care requirements, gentle handling and suitable storage help protect the chain, preserve the finish and reduce strain on beads, clasps and connecting points.",
    image: mangalsutra,
    after:
      "After wearing, gently wipe the mangalsutra with a soft, dry cloth, taking care around beads, the pendant and clasp.",
    cleaning:
      "Check the materials used in the chain, beads and pendant before cleaning. Avoid soaking or applying chemicals without confirming they are safe.",
    storage:
      "Fasten the clasp and lay the mangalsutra neatly in a separate soft pouch to help prevent tangling and scratches.",
    avoid:
      "Avoid pulling the chain, tugging the pendant, soaking the beads or using harsh cleaners on plated and decorative components.",
    unsure:
      "Need help caring for your mangalsutra? Share your order details or a clear photo before trying a new cleaning method.",
  },
];

const FAQS = [
  {
    q: "How do I care for my Roshni Creations jewellery every day?",
    a: "To keep your jewellery looking its best, handle it gently, avoid unnecessary exposure to moisture, perfumes and harsh chemicals, and store each piece separately in a clean, dry pouch. Follow the care instructions for your specific material, as kundan, pearls, resin, beads and plated finishes may have different requirements.",
  },
  {
    q: "How should I clean handmade jewellery made from different materials?",
    a: "When cleaning handmade jewellery that combines stones, beads, fabric, resin or plated metal, consider the care requirements of every component. Avoid soaking, abrasive cleaners and unverified cleaning products. If you are unsure which method is safe, contact Roshni Creations before attempting to clean your piece.",
  },
  {
    q: "Why has my plated jewellery changed colour or lost its shine?",
    a: "Plated jewellery can gradually lose some of its surface finish through friction, moisture, perfumes and everyday wear. If you notice a colour change or dullness, avoid polishing compounds and harsh cleaners. Gently wipe the piece with a soft, dry cloth and contact us for advice specific to its finish.",
  },
  {
    q: "How can I identify the material of my jewellery?",
    a: "Start by checking the product description, product specifications or your order details on the Roshni Creations website. If the material is not clearly listed, share a clear photograph and your order details with our team. We can help you check the available product information and guide you towards suitable care instructions.",
  },
  {
    q: "Can I wear Roshni Creations jewellery while bathing or swimming?",
    a: "It is generally safer to remove fashion jewellery before bathing or swimming unless the care instructions for your specific piece confirm that the exposure is suitable. Water, soap, chlorine and other products may affect beads, fabric, resin decorations, plated finishes or adhesives. For watches, check the manufacturer's verified water-resistance specifications.",
  },
  {
    q: "What is the best way to store jewellery at home or while travelling?",
    a: "Store jewellery in a clean, dry place, preferably in individual soft pouches or separate compartments. Keep necklaces arranged to minimise tangling, protect delicate decorations from scratches, and avoid crushing fabric pieces. When travelling, secure each piece so it cannot move around or rub against other jewellery.",
  },
];

const ESSENTIALS = [
  {
    icon: "pi-cloud",
    title: "Protect from Moisture",
    text: "Keep handmade jewellery away from water, perfumes, and harsh chemicals to help preserve its finish and decorative details.",
  },
  {
    icon: "pi-heart",
    title: "Handle with Care",
    text: "Wear jewellery after applying cosmetics and perfume, and handle delicate pearls, kundan stones, beads, and threads gently.",
  },
  {
    icon: "pi-box",
    title: "Store Jewellery Safely",
    text: "Store each jewellery piece in a clean, dry pouch or separate compartment to prevent scratches, tangling, and damage.",
  },
];

/* ------------------------------------------------------------------
   3. THE PAGE
------------------------------------------------------------------ */

export default function JewelleryCare() {
  // Which material is selected (starts with pearl)
  const [selectedKey, setSelectedKey] = useState("pearl");
  // Which FAQ is open (null = none)
  const [openFaq, setOpenFaq] = useState(null);
  // WhatsApp form
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");

  // Used to scroll down to the guide
  const guideRef = useRef(null);

  // The full material object for the selected key
  const selected = MATERIALS.find((m) => m.key === selectedKey);

  // The 5 instruction blocks for the selected material
  const steps = [
    { title: "After wearing", icon: "pi-star", text: selected.after },
    { title: "Cleaning", icon: "pi-check-circle", text: selected.cleaning },
    { title: "Storage", icon: "pi-box", text: selected.storage },
    { title: "Avoid", icon: "pi-times-circle", text: selected.avoid },
    { title: "When unsure", icon: "pi-question-circle", text: selected.unsure },
  ];

  // Choose a material, then scroll to its guide
  function chooseMaterial(key) {
    setSelectedKey(key);
    setTimeout(() => {
      guideRef.current.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  // Open / close one FAQ
  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  // Open WhatsApp with a ready-made message
  function openWhatsApp() {
    const isNumberValid = /^\d{8,15}$/.test(WHATSAPP_NUMBER);
    if (!isNumberValid) {
      setMessage("Your Number is not valid.");
      return;
    }
    const product = productName || "[please add your product name]";
    const text = `Hello Roshni Creations, I need help with jewellery care. My product is ${product}. Could you please guide me on the appropriate care method?`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setMessage(
      "WhatsApp has opened with a draft message. You can edit it and send it yourself.",
    );
  }

  return (
    <div className="tw:bg-white tw:text-[#625D56]">
      <main className="tw:mx-auto tw:max-w-6xl tw:px-4 tw:md:px-8">
        {/* ---------- Hero ---------- */}
        <section className="tw:grid tw:items-center tw:gap-2 tw:md:gap-8 tw:pb-16 tw:md:grid-cols-2 tw:mt-5 tw:lg:mt-10">
          <div className="tw:flex tw:flex-col tw:text-center tw:md:text-left">
            <p className="tw:mb-1 tw:md:mb-2 tw:text-[10px] tw:lg:text-[12px] tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
              Handmade Jewellery Care Guide
            </p>
            <h1 className="tw:font-serif tw:text-2xl tw:text-[#193A33] tw:md:text-5xl">
              How to Care for Your Jewellery
            </h1>
            <p className="tw:mt-2 tw:md:mt-4 tw:max-w-sm tw:text-[12px] tw:text-[14px]">
              Discover expert jewellery care tips for cleaning, storing and
              protecting your favourite kundan, pearl, resin and handcrafted
              jewellery.
            </p>
            <a
              href="#material-selector"
              className="tw:mt-4 tw:md:mt-6 tw:inline-block tw:text-[#0B4038] tw:hover:underline"
            >
              Explore Jewellery Care Tips ↓
            </a>
          </div>
          <img
            src={HERO_IMAGE}
            alt="Pearl and kundan jewellery on ivory silk"
            className="tw:w-full tw:rounded-sm"
          />
        </section>

        {/* ---------- Step 1: choose a material ---------- */}
        <section
          id="material-selector"
          className="tw:bg-[#FAF7F2] tw:p-6 tw:md:p-8 tw:flex tw:flex-col tw:text-center tw:items-center"
        >
          <p className="tw:text[8px] tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
            Step 1
          </p>
          <h2 className="tw:font-serif tw:text-xl tw:md:text-3xl tw:text-[#193A33]">
            Find care for your jewellery piece
          </h2>
          <p className="tw:mb-5 tw:mt-1 tw:text-[12px] tw:md:text-sm">
            Choose a material to see its care instructions.
          </p>

          <div className="tw:flex tw:flex-wrap tw:gap-3">
            {MATERIALS.map((m) => (
              <Button
                key={m.key}
                unstyled
                type="button"
                aria-pressed={selectedKey === m.key}
                onClick={() => chooseMaterial(m.key)}
                className={
                  "tw:cursor-pointer tw:rounded-full tw:border tw:px-5 tw:py-2 tw:text-[13px] tw:md:text-sm " +
                  (selectedKey === m.key
                    ? "tw:border-[#0B4038] tw:bg-[#0B4038] tw:text-white"
                    : "tw:border-[#d9c9a6] tw:bg-white tw:text-[#193A33] tw:hover:border-[#B18A46]")
                }
              >
                {m.label}
              </Button>
            ))}
          </div>
        </section>

        {/* ---------- Step 2: everyday essentials ---------- */}
        <section className="tw:py-16 tw:flex tw:flex-col tw:text-center tw:items-center">
          <p className="tw:text-[14px] tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
            Step 2
          </p>
          <h2 className="tw:font-serif tw:text-xl tw:md:text-3xl tw:text-[#193A33]">
            Everyday handmade jewellery care essentials
          </h2>
          <p className="tw:mt-1 tw:text-[12px] tw:md:text-sm">
            A few useful habits before exploring material-specific advice.
          </p>

          <div className="tw:mt-8 tw:grid tw:gap-8 tw:md:grid-cols-3">
            {ESSENTIALS.map((item) => (
              <div
                key={item.title}
                className="tw:md:border-l tw:md:border-[#E5DED4] tw:md:pl-6 tw:md:first:border-l-0 tw:md:first:pl-0 tw:flex tw:flex-col tw:items-center"
              >
                <div className="tw:mb-3 tw:flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#F3EDE3] tw:text-[#B18A46]">
                  <i className={`pi ${item.icon}`} />
                </div>
                <h3 className="tw:font-serif tw:text-xl tw:text-[#193A33]">
                  {item.title}
                </h3>
                <p className="tw:mt-1 tw:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="tw:mt-6 tw:text-xs tw:italic">
            These are general reminders. Care recommendations can vary by
            construction and finish.
          </p>
        </section>

        {/* ---------- Care guide for the selected material ---------- */}
        <section ref={guideRef} className="tw:bg-[#FAF7F2] tw:p-6 tw:md:p-8">
          <div className="tw:grid tw:items-center tw:gap-6 tw:md:grid-cols-2">
            <img
              src={selected.image}
              alt={`${selected.label} jewellery`}
              className="tw:w-full tw:rounded-sm"
            />
            <div>
              <p className="tw:text-xs tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
                Care by material
              </p>
              <h2 className="tw:font-serif tw:text-4xl tw:text-[#193A33]">
                {selected.title}
              </h2>
              <p className="tw:mt-3">{selected.intro}</p>
            </div>
          </div>

          {/* The 5 instruction blocks */}
          <div className="tw:mt-6 tw:bg-white tw:p-4">
            <div className="tw:grid tw:lg:grid-cols-5">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="tw:border-t tw:border-[#E5DED4] tw:p-4 tw:first:border-t-0 tw:lg:border-l tw:lg:border-t-0 tw:lg:first:border-l-0"
                >
                  <div className="tw:mb-3 tw:flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#F3EDE3] tw:text-[#B18A46]">
                    <i className={`pi ${step.icon}`} />
                  </div>
                  <h3 className="tw:mb-2 tw:text-xs tw:uppercase tw:tracking-widest tw:text-[#193A33]">
                    {step.title}
                  </h3>
                  <p className="tw:text-sm">{step.text}</p>
                </div>
              ))}
            </div>
            <p className="tw:mt-2 tw:border-t tw:border-[#E5DED4] tw:px-4 tw:pt-3 tw:text-xs">
              Care recommendations depend on the materials, finishes,
              attachments, and construction of each piece. When unsure, contact
              us before attempting a cleaning treatment.
            </p>
          </div>
        </section>

        {/* ---------- Other materials ---------- */}
        <section className="tw:pt-6">
          <p className="tw:mb-3 tw:text-xs tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
            Other materials
          </p>
          <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
            {MATERIALS.filter((m) => m.key !== selectedKey).map((m) => (
              <div
                key={m.key}
                className="tw:flex tw:items-center tw:gap-4 tw:bg-[#FAF7F2] tw:p-4"
              >
                <img
                  src={m.image}
                  alt={`${m.label} jewellery`}
                  className="tw:h-24 tw:w-24 tw:shrink-0 tw:rounded-sm tw:object-cover"
                />
                <div>
                  <h3 className="tw:font-serif tw:text-xl tw:text-[#193A33]">
                    {m.title}
                  </h3>
                  <Button
                    unstyled
                    type="button"
                    onClick={() => chooseMaterial(m.key)}
                    className="tw:cursor-pointer tw:py-2 tw:text-sm tw:text-[#0B4038] tw:hover:underline"
                  >
                    View {m.label.toLowerCase()} care →
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#material-selector"
            className="tw:mt-4 tw:inline-block tw:text-sm tw:text-[#0B4038] tw:hover:underline"
          >
            ↑ Back to material selector
          </a>
        </section>

        {/* ---------- Step 3: FAQ ---------- */}
        <section className="tw:py-16 tw:lg:ml-48">
          <p className="tw:text-xs tw:uppercase tw:tracking-widest tw:text-[#B18A46]">
            Step 3
          </p>
          <h2 className="tw:font-serif tw:text-3xl tw:text-[#193A33]">
            Frequently asked questions
          </h2>
          <p className="tw:mt-1">
            Quick answers to common enquiries about jewellery care.
          </p>

          <div className="tw:mt-6 tw:max-w-3xl tw:border-t tw:border-[#E5DED4]">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="tw:border-b tw:border-[#E5DED4]">
                <Button
                  unstyled
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() => toggleFaq(index)}
                  className="tw:flex tw:w-full tw:cursor-pointer tw:items-center tw:justify-between tw:py-4 tw:text-left tw:text-[#193A33]"
                >
                  <span>{faq.q}</span>
                  <i
                    className={`pi ${openFaq === index ? "pi-minus" : "pi-plus"} tw:text-xs tw:text-[#B18A46]`}
                  />
                </Button>
                {openFaq === index && (
                  <p className="tw:pb-4 tw:text-sm">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Help / WhatsApp ---------- */}
        <section className="tw:grid tw:items-center tw:gap-8 tw:bg-[#FAF7F2] tw:p-6 tw:md:grid-cols-[1fr_2fr] tw:md:p-8">
          <img
            src={POUCH_IMAGE}
            alt="Soft ivory jewellery pouch"
            className="tw:w-full tw:rounded-sm"
          />
          <div>
            <h2 className="tw:font-serif tw:text-3xl tw:text-[#193A33]">
              Not sure how to care for your piece?
            </h2>
            <p className="tw:mb-4 tw:mt-2">
              Share a product photo or your order details. We'll help you find
              the appropriate care guidance before you try a treatment.
            </p>

            <label
              htmlFor="productName"
              className="tw:mb-1 tw:block tw:text-sm tw:text-[#193A33]"
            >
              Product name (optional)
            </label>
            <InputText
              unstyled
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. the name shown on your order"
              className="tw:mb-4 tw:w-full tw:max-w-sm tw:rounded-sm tw:border tw:border-[#d9c9a6] tw:bg-white tw:px-3 tw:py-2"
            />

            <div>
              <Button
                unstyled
                type="button"
                onClick={openWhatsApp}
                className="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-sm tw:bg-[#0B4038] tw:px-6 tw:py-3 tw:text-white tw:hover:bg-[#072d27]"
              >
                <i className="pi pi-whatsapp" />
                Get Care Advice
              </Button>
            </div>

            {message && (
              <p className="tw:mt-3 tw:text-sm tw:text-[#193A33]">{message}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
