// import { useState } from "react";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
import { AiFillInstagram } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import logo from "../../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleExploreClick = (link) => {
    if(link == "About Us"){
      navigate("/about")
    }
    if(link == "Jewellery Care"){
      navigate("/care")
    }
    if(link == "Blogs"){
      navigate("/blog")
    }
    // navigate(`/#${sectionId}`);
  };

  // const [email, setEmail] = useState("");
  // const [subscribed, setSubscribed] = useState(false);

  // const handleSubscribe = () => {
  //   if (!email.trim()) return;
  //   // wire this up to your newsletter provider
  //   setSubscribed(true);
  //   setEmail("");
  // };

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/_roshnicreations",
      Icon: AiFillInstagram,
    },
  ];

  const exploreLinks = ["About Us", "Jewellery Care", "Blogs"];
  const assistanceLinks = [
    "Privacy Policy",
    "Shipping & Returns",
    "Care Guide",
  ];

  return (
    <footer className="tw:bg-[#EDEBE6] tw:pt-14 tw:px-6 tw:sm:px-10 tw:lg:px-16">
      <div className="tw:max-w-7xl tw:mx-auto tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-10 tw:pb-10">
        {/* Brand */}
        <div className="tw:flex tw:flex-col tw:gap-4">
          <div className="tw:w-20 tw:h-20 tw:rounded-full tw:bg-[#F6F1E4] tw:ring-1 tw:!ring-[#C9A24B]/40 tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
            {/* replace src with the actual logo asset */}
            <img
              src={logo}
              alt="Roshni Creations logo"
              className="tw:w-full tw:h-full tw:object-contain"
            />
          </div>

          <h2 className="tw:font-serif tw:text-2xl tw:!text-[#0F5C4A]">
            Roshni Creations
          </h2>

          <p className="tw:text-sm tw:leading-relaxed tw:text-[#5B5B54] tw:max-w-[26ch]">
            Crafting timeless elegance for your cherished moments. Heritage
            meets modern design.
          </p>

          <div className="tw:flex tw:items-center tw:gap-4 tw:pt-1">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="tw:!text-[#3A3A34] tw:opacity-80 tw:hover:opacity-100 tw:transition-opacity"
              >
                <Icon size={18} strokeWidth={1.75} />
              </a>
            ))}
            <Link to={"/admin/login"}>
              <MdAdminPanelSettings size={18} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Explore */}
        <FooterColumn
          title="Explore"
          links={exploreLinks}
          onExploreClick={handleExploreClick}
        />

        {/* Assistance */}
        <FooterColumn
          title="Assistance"
          links={assistanceLinks}
          basePath="/assistance"
        />

        {/* Stay Connected */}
        <div className="tw:flex tw:flex-col tw:gap-4">
          <h3 className="tw:text-sm tw:font-semibold tw:tracking-wide tw:!text-[#1F1F1A]">
            Stay Connected
          </h3>

          <p className="tw:text-sm tw:leading-relaxed tw:!text-[#5B5B54]">
            Stay inspired with Roshni Creations — discover handcrafted
            jewellery, new collections, styling ideas, and special offers, made
            with love for your everyday elegance.
          </p>

          {/* <div className="tw:flex tw:items-center tw:border-b tw:!border-[#B9B6AC] tw:pb-2">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="tw:flex-1 tw:bg-transparent tw:border-none tw:outline-none tw:shadow-none tw:text-sm tw:!text-[#3A3A34] tw:placeholder:!text-[#9B988E]"
            />
            <Button
              icon="pi pi-arrow-right"
              rounded
              text
              aria-label="Subscribe"
              onClick={handleSubscribe}
              className="tw:!text-[#0F5C4A] tw:w-8 tw:h-8"
            />
          </div> */}

          {/* {subscribed && (
            <span className="tw:text-xs tw:!text-[#0F5C4A]">
              Thanks for subscribing!
            </span>
          )} */}
        </div>
      </div>

      <hr className="tw:border-t tw:border-[#D8D5CC]" />

      <div className="tw:max-w-7xl tw:mx-auto tw:flex tw:flex-col tw:sm:flex-row tw:items-center tw:justify-between tw:gap-3 tw:py-6 tw:text-xs tw:text-[#6B685F]">
        <p>
          © 2026 <span className="tw:font-bold">Roshni Creations</span> .
          Crafted By{" "}
          <a
            className="tw:font-bold tw:cursor-pointer"
            href="https://satyaanshsoftech.com"
            target="_blank"
          >
            Satyaansh Softech Pvt. Ltd.
          </a>{" "}
          .
        </p>

        <div className="tw:flex tw:items-center tw:gap-3 tw:opacity-70">
          <i className="pi pi-wallet tw:text-base" />
          <i className="pi pi-credit-card tw:text-base" />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, basePath, onExploreClick }) {
  const toSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <div className="tw:flex tw:flex-col tw:gap-4">
      <h3 className="tw:text-sm tw:font-semibold tw:tracking-wide tw:text-[#1F1F1A]">
        {title}
      </h3>

      <ul className="tw:flex tw:flex-col tw:gap-3 ">
        {links.map((link) => (
          <li key={link}>
            {onExploreClick ? (
              <button
                type="button"
                onClick={() => onExploreClick(link)}
                className="tw:text-sm tw:!text-[#5B5B54] tw:hover:!text-[#0F5C4A] tw:transition-colors tw:text-left tw:cursor-pointer"
              >
                {link}
              </button>
            ) : (
              <Link
                to={`${basePath}/${toSlug(link)}`}
                className="tw:text-sm tw:!text-[#5B5B54] tw:hover:!text-[#0F5C4A] tw:transition-colors tw:cursor-pointer"
              >
                {link}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
