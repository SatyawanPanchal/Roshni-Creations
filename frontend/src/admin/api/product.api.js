
import api, { NotImplementedError } from "./axiosClient.js";

// ============================================================
// GET ALL PRODUCTS
// ============================================================
// GET /product/getProducts
export async function getAllProducts() {
  const { data } = await api.get("/product/getProducts");
  console.log("res of get all products", data.data);
  return data.data;
}

// ============================================================
// GET SINGLE PRODUCT
// ============================================================
// GET /product/getProduct/:id
export async function getProductById(id) {
  const { data } = await api.get(`/product/getProduct/${id}`);
  return data.data;
}

// ============================================================
// SEARCH PRODUCTS
// ============================================================
// GET /product/search?query=
export async function searchProducts(query) {
  const { data } = await api.get("/product/search", {
    params: { query },
  });

  return data.data;
}

// ============================================================
// CREATE PRODUCT
// ============================================================
// POST /product/addProduct
export async function createProduct(payload) {
  const fd = buildProductFormData(payload);

  const { data } = await api.post("/product/addProduct", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

// ============================================================
// DELETE PRODUCT
// ============================================================
// DELETE /product/deleteProduct/:id
export async function deleteProduct(id) {
  const { data } = await api.delete(`/product/deleteProduct/${id}`);
  return data;
}

// ============================================================
// UPDATE PRODUCT
// ============================================================
// PUT /product/updateProduct/:id
//
// Supports:
// - normal product fields
// - main image replacement
// - additional image replacement by index
// - adding new additional images
export async function updateProduct(id, payload) {
  const fd = buildProductFormData(payload);

  try {
    const { data } = await api.put(
      `/product/updateProduct/${id}`,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PUT",
        "/product/updateProduct/:id",
        "multipart/form-data product update endpoint is required.",
      );
    }

    throw err;
  }
}

// ============================================================
// UPDATE PRODUCT STOCK
// ============================================================
// PATCH /product/updateStock/:id
export async function updateProductStock(id, { mode, quantity }) {
  try {
    const { data } = await api.patch(
      `/product/updateStock/${id}`,
      {
        mode,
        quantity,
      },
    );

    return data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PATCH",
        "/product/updateStock/:id",
        'body: { mode: "add"|"remove"|"set"|"out_of_stock"|"made_to_order", quantity: number }',
      );
    }

    throw err;
  }
}

// ============================================================
// TOGGLE PRODUCT STATUS
// ============================================================
// PATCH /product/:id/status
export async function toggleProductStatus(id, isActive) {
  try {
    const { data } = await api.patch(
      `/product/${id}/status`,
      { isActive },
    );

    return data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PATCH",
        "/product/:id/status",
        "body: { isActive: boolean }",
      );
    }

    throw err;
  }
}

// ============================================================
// BUILD PRODUCT FORM DATA
// ============================================================

function buildProductFormData({
  name,
  price,
  compareAtPrice,
  productCode,
  category,
  subcategory,
  collections,
  material,
  availability,
  badge,
  stockLeft,
  craftLabel,
  details,
  care,
  shipping,

  // Main image
  imageFile,

  // New additional images
  imagesFiles,

  // Existing additional images
  existingImages,

  // Replacement additional images
  replacementImages,
}) {
  const fd = new FormData();

  // ----------------------------------------------------------
  // BASIC PRODUCT DATA
  // ----------------------------------------------------------

  if (name !== undefined) {
    fd.append("name", name);
  }

  if (price !== undefined) {
    fd.append("price", price);
  }

  if (
    compareAtPrice !== undefined &&
    compareAtPrice !== null &&
    compareAtPrice !== ""
  ) {
    fd.append("compareAtPrice", compareAtPrice);
  }

  if (productCode !== undefined) {
    fd.append("productCode", productCode);
  }

  if (category !== undefined) {
    fd.append("category", category);
  }

  if (subcategory !== undefined) {
    fd.append("subcategory", subcategory);
  }

  if (collections !== undefined) {
    fd.append(
      "collections",
      JSON.stringify(collections || []),
    );
  }

  if (material !== undefined) {
    fd.append("material", material);
  }

  if (availability !== undefined) {
    fd.append("availability", availability);
  }

  if (badge !== undefined) {
    const badgeValue =
      typeof badge === "object"
        ? badge?.value || ""
        : badge || "";

    fd.append("badge", badgeValue);
  }

  if (stockLeft !== undefined) {
    fd.append("stockLeft", stockLeft);
  }

  if (craftLabel !== undefined) {
    fd.append("craftLabel", craftLabel);
  }

  if (details !== undefined) {
    fd.append("details", details);
  }

  if (care !== undefined) {
    fd.append("care", care);
  }

  if (shipping !== undefined) {
    fd.append("shipping", shipping);
  }

  // ----------------------------------------------------------
  // MAIN IMAGE
  // ----------------------------------------------------------

  if (imageFile) {
    fd.append("image", imageFile);
  }

  // ----------------------------------------------------------
  // EXISTING ADDITIONAL IMAGES
  // ----------------------------------------------------------
  //
  // Example:
  //
  // existingImages = [
  //   "https://cloudinary/image1.jpg",
  //   "https://cloudinary/image2.jpg",
  //   "https://cloudinary/image3.jpg"
  // ]
  //
  // This tells backend which old images are still present.
  //

  if (existingImages !== undefined) {
    fd.append(
      "existingImages",
      JSON.stringify(existingImages || []),
    );
  }

  // ----------------------------------------------------------
  // NEW ADDITIONAL IMAGES
  // ----------------------------------------------------------
  //
  // Used when clicking the "+" box and adding new images.
  //

  if (imagesFiles?.length) {
    imagesFiles.forEach((file) => {
      fd.append("images", file);
    });
  }

  // ----------------------------------------------------------
  // REPLACEMENT ADDITIONAL IMAGES
  // ----------------------------------------------------------
  //
  // Expected format:
  //
  // replacementImages = [
  //   {
  //     index: 0,
  //     file: File
  //   },
  //   {
  //     index: 2,
  //     file: File
  //   }
  // ]
  //
  // This allows:
  //
  // Image 1 -> replace
  // Image 2 -> keep
  // Image 3 -> replace
  // Image 4 -> keep
  //

  if (replacementImages?.length) {
  replacementImages.forEach(({ index, file }) => {
    if (!file) return;

    fd.append("images", file);
    fd.append("imageIndexes", String(index));
  });
}

  return fd;
}
