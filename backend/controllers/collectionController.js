import collectionModel from "../models/collectionModel.js";
import cloudinary from "../config/cloudinary.js";

// ============================================================
// ADD COLLECTION
// ============================================================

const addCollection = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
    } = req.body;

    const collectionImage = req.file?.path;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required",
      });
    }

    // --------------------------------------------------------
    // CHECK EXISTING COLLECTION
    // --------------------------------------------------------

    const existingCollection = await collectionModel.findOne({
      $or: [
        { title: title.trim() },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (existingCollection) {
      return res.status(400).json({
        success: false,
        message: "Collection already exists",
      });
    }

    // --------------------------------------------------------
    // CREATE COLLECTION
    // --------------------------------------------------------

    const newCollection = new collectionModel({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim(),
      image: collectionImage,
    });

    await newCollection.save();

    return res.status(201).json({
      success: true,
      message: "Collection added successfully",
      data: newCollection,
    });
  } catch (error) {
    console.error("Error adding collection:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding collection",
    });
  }
};

// ============================================================
// GET ALL COLLECTIONS
// ============================================================

const getAllCollections = async (req, res) => {
  try {
    const collections = await collectionModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching collections",
    });
  }
};

// ============================================================
// GET ACTIVE COLLECTIONS
// ============================================================

const getActiveCollections = async (req, res) => {
  try {
    const collections = await collectionModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error(
      "Error fetching active collections:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching active collections",
    });
  }
};

// ============================================================
// GET SINGLE COLLECTION
// ============================================================

const getSingleCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching collection",
    });
  }
};

// ============================================================
// UPDATE COLLECTION
// ============================================================

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      description,
      isActive,
    } = req.body;

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE TITLE / SLUG
    // --------------------------------------------------------

    if (title || slug) {
      const duplicate = await collectionModel.findOne({
        _id: { $ne: id },
        $or: [
          ...(title
            ? [{ title: title.trim() }]
            : []),
          ...(slug
            ? [{ slug: slug.trim().toLowerCase() }]
            : []),
        ],
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Collection title or slug already exists",
        });
      }
    }

    // --------------------------------------------------------
    // UPDATE IMAGE
    // --------------------------------------------------------

    if (req.file?.path) {
      if (collection.image) {
        try {
          const uploadIndex =
            collection.image.indexOf("/upload/");

          if (uploadIndex !== -1) {
            let publicId = collection.image.substring(
              uploadIndex + 8,
            );

            publicId = publicId.replace(
              /^v\d+\//,
              "",
            );

            publicId = publicId.replace(
              /\.[^/.]+$/,
              "",
            );

            await cloudinary.uploader.destroy(
              publicId,
            );
          }
        } catch (error) {
          console.error(
            "Cloudinary image delete error:",
            error.message,
          );
        }
      }

      collection.image = req.file.path;
    }

    // --------------------------------------------------------
    // UPDATE FIELDS
    // --------------------------------------------------------

    if (title !== undefined) {
      collection.title = title.trim();
    }

    if (slug !== undefined) {
      collection.slug = slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      collection.description = description.trim();
    }

    if (isActive !== undefined) {
      collection.isActive =
        isActive === true ||
        isActive === "true";
    }

    await collection.save();

    return res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    });
  } catch (error) {
    console.error(
      "Error updating collection:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Error updating collection",
    });
  }
};

// ============================================================
// DELETE COLLECTION
// ============================================================

const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection =
      await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // --------------------------------------------------------
    // DELETE IMAGE FROM CLOUDINARY
    // --------------------------------------------------------

    if (collection.image) {
      try {
        const uploadIndex =
          collection.image.indexOf("/upload/");

        if (uploadIndex !== -1) {
          let publicId = collection.image.substring(
            uploadIndex + 8,
          );

          publicId = publicId.replace(
            /^v\d+\//,
            "",
          );

          publicId = publicId.replace(
            /\.[^/.]+$/,
            "",
          );

          await cloudinary.uploader.destroy(
            publicId,
          );
        }
      } catch (error) {
        console.error(
          "Cloudinary image delete error:",
          error.message,
        );
      }
    }

    // --------------------------------------------------------
    // DELETE COLLECTION
    // --------------------------------------------------------

    await collectionModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting collection:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Error deleting collection",
    });
  }
};

export {
  addCollection,
  getAllCollections,
  getActiveCollections,
  getSingleCollection,
  updateCollection,
  deleteCollection,
};