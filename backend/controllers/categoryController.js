import Category from "../models/categoryModel.js";

// ==================================================
// ADD CATEGORY
// ==================================================

export const addCategory = async (req, res) => {
  try {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, category, menuGroup, menuOrder, isActive } = req.body || {};

    // Cloudinary image
    const heroImg = req.file?.path;

    if (!heroImg || !title || !category) {
      return res.status(400).json({
        success: false,
        message: "Hero image, title and category are required",
      });
    }

    const normalizedCategory = category.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      category: normalizedCategory,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = await Category.create({
      heroImg: heroImg,
      title: title.trim(),
      category: normalizedCategory,

      menuGroup: menuGroup !== undefined ? Number(menuGroup) : 1,

      menuOrder: menuOrder !== undefined ? Number(menuOrder) : 0,

      isActive:
        isActive !== undefined
          ? isActive === true || isActive === "true"
          : true,
    });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Add category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================================================
// GET ALL ACTIVE CATEGORIES
// ==================================================

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .sort({
        menuGroup: 1,
        menuOrder: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// ==================================================
// GET ALL CATEGORIES
// ==================================================
// This one is mainly useful for ADMIN

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({
        menuGroup: 1,
        menuOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get admin categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// ==================================================
// GET CATEGORY BY ID
// ==================================================

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching category",
    });
  }
};

// ==================================================
// UPDATE CATEGORY
// ==================================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, category, menuGroup, menuOrder, isActive } = req.body;

    // ----------------------------------------------
    // FIND CATEGORY
    // ----------------------------------------------

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ----------------------------------------------
    // UPDATE IMAGE IF PROVIDED
    // ----------------------------------------------

    if (req.file) {
      existingCategory.heroImg = req.file.path;
    }

    // ----------------------------------------------
    // UPDATE TITLE
    // ----------------------------------------------

    if (title !== undefined) {
      existingCategory.title = title.trim();
    }

    // ----------------------------------------------
    // UPDATE CATEGORY
    // ----------------------------------------------

    if (category !== undefined) {
      const normalizedCategory = category.trim().toLowerCase();

      // Check if another category uses same name
      const duplicateCategory = await Category.findOne({
        category: normalizedCategory,
        _id: { $ne: id },
      });

      if (duplicateCategory) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      existingCategory.category = normalizedCategory;
    }

    // ----------------------------------------------
    // UPDATE MENU GROUP
    // ----------------------------------------------

    if (menuGroup !== undefined) {
      existingCategory.menuGroup = Number(menuGroup);
    }

    // ----------------------------------------------
    // UPDATE MENU ORDER
    // ----------------------------------------------

    if (menuOrder !== undefined) {
      existingCategory.menuOrder = Number(menuOrder);
    }

    // ----------------------------------------------
    // UPDATE ACTIVE STATUS
    // ----------------------------------------------

    if (isActive !== undefined) {
      existingCategory.isActive = isActive === "true" || isActive === true;
    }

    // ----------------------------------------------
    // SAVE
    // ----------------------------------------------

    await existingCategory.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: existingCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

// ==================================================
// DELETE CATEGORY
// ==================================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ----------------------------------------------
    // DELETE CATEGORY
    // ----------------------------------------------

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
};
