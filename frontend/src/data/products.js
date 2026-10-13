// Centralized product data.
// Replace image paths with real asset paths (or wire up to an API later —
// this shape is designed to map 1:1 onto a typical products endpoint).

export const trendingProducts = [
  {
    id: "trend-1",
    name: "Silver Divya Kadan",
    price: "Rs. 80,829.00",
    image: "/images/products/product-1.webp",
    secondaryImage: "/images/products/product-1-hover.webp",
  },
  {
    id: "trend-2",
    name: "Silver Sabina Bracelet",
    price: "Rs. 73,913.00",
    image: "/images/products/product-2.webp",
    secondaryImage: "/images/products/product-2-hover.webp",
  },
  {
    id: "trend-3",
    name: "Silver Juana Edge",
    price: "Rs. 28,878.00",
    image: "/images/products/product-3.webp",
    secondaryImage: "/images/products/product-3-hover.webp",
  },
  {
    id: "trend-4",
    name: "Silver Julia Bloom",
    price: "Rs. 20,274.00",
    image: "/images/products/product-4.webp",
    secondaryImage: "/images/products/product-4-hover.webp",
  },
];

// Festive / Handpicked / Bestsellers reuse the same shape — swap in real
// curated lists per section once the catalog/API is connected.
export const festiveProducts = trendingProducts;
export const handpickedProducts = trendingProducts;
export const bestsellerProducts = trendingProducts;
