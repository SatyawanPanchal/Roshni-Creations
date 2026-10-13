import { Link, useParams } from "react-router-dom";
import { Card } from "primereact/card";

const pages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    points: [
      "We collect only the details needed to process your order, such as your name, address, phone number and email.",
      "Your information is never sold or shared with third parties, except delivery and payment partners who need it to complete your order.",
      "Payments are processed through secure payment gateways. We do not store your card details.",
      "If you subscribe to our newsletter, you can unsubscribe at any time.",
      "For any privacy-related questions, please contact us through our Instagram page.",
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping & Returns",
    points: [
      "Orders are usually dispatched within 2-4 business days.",
      "Delivery typically takes 5-8 business days, depending on your location.",
      "You will receive tracking details once your order is shipped.",
      "No returns: returns are not allowed, and no product will be returned or refunded once purchased.",
      "Please check product details and images carefully before placing your order.",
      "If your parcel arrives damaged, contact us within 24 hours with an unboxing video so we can look into it.",
    ],
  },
  {
    slug: "care-guide",
    title: "Care Guide",
    points: [
      "Keep your jewellery away from water, perfume, sprays and chemicals.",
      "Put it on last after makeup, and take it off first.",
      "Wipe gently with a soft, dry cloth after each use.",
      "Store each piece separately in a dry pouch or box to avoid scratches.",
      "Remove jewellery before sleeping, bathing or exercising.",
    ],
  },
];

export default function AssistancePage() {
  const { slug } = useParams();
  const current = pages.find((p) => p.slug === slug) || pages[0];

  return (
    <section className="tw:max-w-5xl tw:mx-auto tw:px-6 tw:py-12 tw:flex tw:flex-col tw:md:flex-row tw:gap-8">
      {/* Menu */}
      <nav className="tw:flex tw:md:flex-col tw:gap-2 tw:md:w-56">
        {pages.map((p) => (
          <Link
            key={p.slug}
            to={`/assistance/${p.slug}`}
            className={`tw:px-4 tw:py-2 tw:rounded tw:text-sm tw:transition-colors ${
              p.slug === current.slug
                ? "tw:bg-[#0F5C4A] tw:!text-white"
                : "tw:bg-[#EDEBE6] tw:!text-[#5B5B54] tw:hover:!text-[#0F5C4A]"
            }`}
          >
            {p.title}
          </Link>
        ))}
      </nav>

      {/* Content */}
      <div className="tw:flex-1">
        <Card title={current.title}>
          <ul className="tw:list-disc tw:pl-5 tw:flex tw:flex-col tw:gap-3 tw:text-sm tw:text-[#5B5B54]">
            {current.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}