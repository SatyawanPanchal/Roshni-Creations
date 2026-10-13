import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import collectionModel from "../models/collectionModel.js";
import cloudinary from "../config/cloudinary.js";

// ============================================================
// ADD PRODUCT
// ============================================================

const addProduct = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // --------------------------------------------------------
    // PRODUCT IMAGES
    // --------------------------------------------------------

    const mainImage = req.files?.image?.[0]?.path;

    const additionalImages = req.files?.images?.map((file) => file.path) || [];

    // --------------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name are required",
      });
    }
    if (price === undefined) {
      return res.status(400).json({
        success: false,
        message: " price are required",
      });
    }
    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: " product code are required",
      });
    }
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category  are required",
      });
    }
    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "` main image are required",
      });
    }

    // --------------------------------------------------------
    // VALIDATE CATEGORY ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const existingCategory = await categoryModel.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Selected category does not exist",
      });
    }

    // --------------------------------------------------------
    // CHECK PRODUCT CODE
    // --------------------------------------------------------

    const existingProduct = await productModel.findOne({
      productCode: productCode.toUpperCase(),
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product code already exists",
      });
    }

    // --------------------------------------------------------
    // PARSE COLLECTIONS
    // --------------------------------------------------------

    let collectionsArray = [];

    if (collections) {
      try {
        collectionsArray =
          typeof collections === "string"
            ? JSON.parse(collections)
            : collections;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid collections format",
        });
      }
    }

    // --------------------------------------------------------
    // VALIDATE COLLECTIONS
    // --------------------------------------------------------

    if (!Array.isArray(collectionsArray)) {
      return res.status(400).json({
        success: false,
        message: "Collections must be an array",
      });
    }

    for (const collectionId of collectionsArray) {
      if (!mongoose.Types.ObjectId.isValid(collectionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid collection ID",
        });
      }
    }

    if (collectionsArray.length > 0) {
      const existingCollections = await collectionModel.find({
        _id: { $in: collectionsArray },
        isActive: true,
      });

      if (existingCollections.length !== collectionsArray.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected collections do not exist or are inactive",
        });
      }
    }

    // --------------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------------

    const newProduct = new productModel({
      name: name.trim(),

      price: Number(price),

      compareAtPrice:
        compareAtPrice !== undefined && compareAtPrice !== ""
          ? Number(compareAtPrice)
          : undefined,

      productCode: productCode.toUpperCase(),

      category,

      subcategory: subcategory?.trim() || undefined,

      collections: collectionsArray,

      material: material?.trim() || undefined,

      availability: availability || "in-stock",

      badge: badge?.trim() || undefined,

      stockLeft:
        stockLeft !== undefined && stockLeft !== "" ? Number(stockLeft) : 0,

      craftLabel: craftLabel?.trim() || undefined,

      details: details?.trim() || undefined,

      care: care?.trim() || undefined,

      shipping: shipping?.trim() || undefined,

      image: mainImage,

      images: additionalImages,
    });

    await newProduct.save();

    // --------------------------------------------------------
    // RETURN POPULATED PRODUCT
    // --------------------------------------------------------

    const populatedProduct = await productModel
      .findById(newProduct._id)
      .populate("category")
      .populate("collections");

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: populatedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding product",
    });
  }
};

// ============================================================
// GET ALL PRODUCTS
// ============================================================

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category")
      .populate("collections")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// ============================================================
// GET SINGLE PRODUCT
// ============================================================

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel
      .findById(id)
      .populate("category")
      .populate("collections");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};

// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    let categoryId = category;

    // --------------------------------------------------------
    // If category is an ID
    // --------------------------------------------------------

    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryId = category;
    } else {
      // ------------------------------------------------------
      // Otherwise find category by title
      // ------------------------------------------------------

      const categoryDocument = await categoryModel.findOne({
        title: {
          $regex: `^${category}$`,
          $options: "i",
        },
      });

      if (!categoryDocument) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      categoryId = categoryDocument._id;
    }

    // --------------------------------------------------------
    // FIND PRODUCTS
    // --------------------------------------------------------

    const products = await productModel
      .find({
        category: categoryId,
      })
      .populate("category")
      .populate("collections")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching category products",
    });
  }
};

// ============================================================
// GET PRODUCTS BY COLLECTION
// ============================================================

const getProductsByCollection = async (req, res) => {
  try {
    const { collection } = req.params;

    let collectionId = collection;

    // --------------------------------------------------------
    // If collection is not an ID,
    // find it using slug
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(collection)) {
      const collectionDocument = await collectionModel.findOne({
        slug: collection.toLowerCase(),
      });

      if (!collectionDocument) {
        return res.status(404).json({
          success: false,
          message: "Collection not found",
        });
      }

      collectionId = collectionDocument._id;
    }

    // --------------------------------------------------------
    // FIND PRODUCTS
    // --------------------------------------------------------

    const products = await productModel
      .find({
        collections: collectionId,
      })
      .populate("category")
      .populate("collections")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching collection products:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching collection products",
    });
  }
};

// ============================================================
// SEARCH PRODUCTS
// ============================================================

const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const products = await productModel
      .find({
        $or: [
          {
            productCode: {
              $regex: query,
              $options: "i",
            },
          },
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          {
            subcategory: {
              $regex: query,
              $options: "i",
            },
          },
          {
            material: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      })
      .populate("category")
      .populate("collections")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

// ============================================================
// DELETE PRODUCT
// ============================================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE PRODUCT ID:", id);

    const product = await productModel.findById(id);

    if (!product) {
      console.log("PRODUCT NOT FOUND:", id);

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // --------------------------------------------------------
    // DELETE IMAGES FROM CLOUDINARY
    // --------------------------------------------------------

    const images = [
      product.image,
      ...(Array.isArray(product.images) ? product.images : []),
    ];

    for (const image of images) {
      if (!image) continue;

      try {
        const uploadIndex = image.indexOf("/upload/");

        if (uploadIndex === -1) {
          console.log("Invalid Cloudinary URL:", image);
          continue;
        }

        let publicId = image.substring(uploadIndex + "/upload/".length);

        // Remove version: v123456789/
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove extension
        publicId = publicId.replace(/\.[^/.]+$/, "");

        console.log("Deleting Cloudinary image:", publicId);

        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Cloudinary delete error:", error.message);
      }
    }

    // --------------------------------------------------------
    // DELETE PRODUCT FROM DATABASE
    // --------------------------------------------------------

    await productModel.findByIdAndDelete(id);

    console.log("PRODUCT DELETED:", id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // FIND PRODUCT
    // --------------------------------------------------------

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
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
    } = req.body;

    // ========================================================
    // CATEGORY
    // ========================================================

    if (category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      const existingCategory = await categoryModel.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Selected category does not exist",
        });
      }

      product.category = category;
    }

    // ========================================================
    // PRODUCT CODE
    // ========================================================

    if (
      productCode !== undefined &&
      productCode.toUpperCase() !== product.productCode
    ) {
      const existingProduct = await productModel.findOne({
        productCode: productCode.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product code already exists",
        });
      }

      product.productCode = productCode.toUpperCase();
    }

    // ========================================================
    // COLLECTIONS
    // ========================================================

    if (collections !== undefined) {
      let collectionsArray = [];

      try {
        collectionsArray =
          typeof collections === "string"
            ? JSON.parse(collections)
            : collections;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid collections format",
        });
      }

      if (!Array.isArray(collectionsArray)) {
        return res.status(400).json({
          success: false,
          message: "Collections must be an array",
        });
      }

      for (const collectionId of collectionsArray) {
        if (!mongoose.Types.ObjectId.isValid(collectionId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid collection ID",
          });
        }
      }

      if (collectionsArray.length > 0) {
        const existingCollections = await collectionModel.find({
          _id: {
            $in: collectionsArray,
          },
          isActive: true,
        });

        if (existingCollections.length !== collectionsArray.length) {
          return res.status(400).json({
            success: false,
            message:
              "One or more selected collections do not exist or are inactive",
          });
        }
      }

      product.collections = collectionsArray;
    }

    // ========================================================
    // SIMPLE FIELDS
    // ========================================================

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (compareAtPrice !== undefined) {
      product.compareAtPrice =
        compareAtPrice === "" ? undefined : Number(compareAtPrice);
    }

    if (subcategory !== undefined) {
      product.subcategory = subcategory.trim();
    }

    if (material !== undefined) {
      product.material = material.trim();
    }

    if (availability !== undefined) {
      product.availability = availability;
    }

    if (badge !== undefined) {
      const badgeValue =
        typeof badge === "object" ? badge?.value || "" : badge || "";

      product.badge = badgeValue.trim() || undefined;
    }

    if (stockLeft !== undefined) {
      product.stockLeft = Number(stockLeft);
    }

    if (craftLabel !== undefined) {
      product.craftLabel = craftLabel.trim();
    }

    if (details !== undefined) {
      product.details = details.trim();
    }

    if (care !== undefined) {
      product.care = care.trim();
    }

    if (shipping !== undefined) {
      product.shipping = shipping.trim();
    }

    // ========================================================
    // MAIN IMAGE
    // ========================================================

    const newMainImage = req.files?.image?.[0]?.path;

    if (newMainImage) {
      product.image = newMainImage;
    }

    // ========================================================
    // ADDITIONAL IMAGE REPLACEMENTS
    // ========================================================

    const newAdditionalImages = req.files?.images || [];

    let imageIndexes = req.body.imageIndexes || [];

    // If only one index was submitted,
    // Express/Multer may return a string.
    if (!Array.isArray(imageIndexes)) {
      imageIndexes = [imageIndexes];
    }

    if (newAdditionalImages.length) {
      // Start with existing images
      const updatedImages = [...(product.images || [])];

      newAdditionalImages.forEach((file, fileIndex) => {
        const imageIndex = Number(imageIndexes[fileIndex]);

        // --------------------------------------------------
        // Validate index
        // --------------------------------------------------

        if (!Number.isInteger(imageIndex)) {
          return;
        }

        if (imageIndex < 0 || imageIndex >= 5) {
          return;
        }

        // --------------------------------------------------
        // Replace ONLY that image
        // --------------------------------------------------

        updatedImages[imageIndex] = file.path;
      });

      product.images = updatedImages;
    }

    // ========================================================
    // SAVE
    // ========================================================

    await product.save();

    // ========================================================
    // POPULATE
    // ========================================================

    const populatedProduct = await productModel
      .findById(product._id)
      .populate("category")
      .populate("collections");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: populatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode, quantity } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const qty = Number(quantity) || 0;

    switch (mode) {
      case "add":
        product.stockLeft = product.stockLeft + qty;
        product.availability = "in-stock";
        break;
      case "remove":
        product.stockLeft = Math.max(0, product.stockLeft - qty);
        if (product.stockLeft === 0) product.availability = "out-of-stock";
        break;
      case "set":
        product.stockLeft = Math.max(0, qty);
        product.availability =
          product.stockLeft > 0 ? "in-stock" : "out-of-stock";
        break;
      case "out_of_stock":
        product.stockLeft = 0;
        product.availability = "out-of-stock";
        break;
      case "made_to_order":
        product.stockLeft = 0;
        product.availability = "made-to-order";
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid stock update mode",
        });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating stock",
    });
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = isActive === true || isActive === "true";
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? "activated" : "deactivated"} successfully`,
      data: product,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating product status",
    });
  }
};

export {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
  getProductsByCollection,
  searchProduct,
  deleteProduct,
  updateProduct,
  updateStock,
  toggleProductStatus,
};
