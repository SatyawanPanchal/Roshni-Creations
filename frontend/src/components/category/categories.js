/* eslint-disable no-unused-vars */
/**
 * categories.js
 * -----------------------------------------------------------------------
 * Single source of truth for the six ROSHNI categories. RoshniCategories
 * maps over this array and renders one <CategoryLetter /> per entry, so
 * adding, reordering, or renaming a category never touches component code.
 *
 * Replace each `image` with the real, brand-approved product/editorial
 * photograph for that category before shipping — these paths are
 * placeholders only.
 * -----------------------------------------------------------------------
 */

import earringsImage from "../../images/categoryImages/earrings.png";
import necklacesImage from "../../images/categoryImages/necklaces.webp";
import braceletsImage from "../../images/categoryImages/bracelets.webp";
import resinImage from "../../images/categoryImages/resinJewellery.webp";
import fabricJewelleryImage from "../../images/categoryImages/fabricJewellery.webp";
import watchesImage from "../../images/categoryImages/kashmereWatch.webp";

export const ROSHNI_CATEGORIES = [
  {
    id: "earrings",
    letter: "R",
    title: "Earrings",
    href: "/collections/earrings",
    image: earringsImage,
    alt: "Woman in a three-quarter portrait wearing statement earrings, one ear visible through her hair",
  },
  {
    id: "necklaces",
    letter: "O",
    title: "Necklaces",
    href: "/collections/necklaces",
    image:necklacesImage ,
    alt: "Upper-body portrait of a woman wearing a centred necklace against an ivory silk neckline",
  },
  {
    id: "bracelets",
    letter: "S",
    title: "Bracelets",
    href: "/collections/bracelets",
    image: braceletsImage,
    alt: "Close, candid shot of a hand adjusting a stack of bracelets at the wrist",
  },
  {
    id: "resin",
    letter: "H",
    title: "Resin",
    href: "/collections/resin",
    image: resinImage,
    alt: "Handcrafted resin jewellery with pressed botanicals suspended in glossy, translucent resin",
  },
  {
    id: "fabric-jewellery",
    letter: "N",
    title: "Fabric Jewellery",
    href: "/collections/fabric-jewellery",
    image: fabricJewelleryImage,
    alt: "Woman wearing handcrafted fabric jewellery, textile folds visible against a draped saree",
  },
  {
    id: "watches",
    letter: "I",
    title: "Watches",
    href: "/collections/watches",
    image:watchesImage ,
    alt: "Wrist turned toward the viewer wearing a contemporary watch, sleeve softly folded back",
  },
];
