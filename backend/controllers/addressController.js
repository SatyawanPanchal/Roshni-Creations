import mongoose from "mongoose";
import addressModel from "../models/addressModel.js";

// Fields that users are allowed to create/update
const allowedFields = [
  "firstName",
  "lastName",
  "phone",
  "country",
  "flat",
  "street",
  "city",
  "state",
  "pincode",
  "landmark",
  "addressType",
  "isDefault",
];

const getAddressData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// --------------------------------------------------
// ADD ADDRESS
// --------------------------------------------------
const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const addressData = getAddressData(req.body);

    // Check if user already has addresses
    const existingAddressCount = await addressModel.countDocuments({
      userId,
    });

    // First address automatically becomes default
    if (existingAddressCount === 0) {
      addressData.isDefault = true;
    }

    // If user wants this address as default,
    // remove default from all other addresses
    if (addressData.isDefault === true) {
      await addressModel.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await addressModel.create({
      userId,
      ...addressData,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please provide valid address details",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
};

// --------------------------------------------------
// GET ALL ADDRESSES
// --------------------------------------------------
const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await addressModel
      .find({ userId })
      .sort({
        isDefault: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Get Addresses Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

// --------------------------------------------------
// GET SINGLE ADDRESS
// --------------------------------------------------
const getAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Get Address Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching address",
    });
  }
};

// --------------------------------------------------
// UPDATE ADDRESS
// --------------------------------------------------
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const existingAddress = await addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const updateData = getAddressData(req.body);

    // If this address is being made default
    if (updateData.isDefault === true) {
      await addressModel.updateMany(
        {
          userId,
          _id: { $ne: addressId },
        },
        {
          $set: { isDefault: false },
        }
      );
    }

    // Prevent the user from removing the only/default
    // address as default without another default.
    if (
      updateData.isDefault === false &&
      existingAddress.isDefault === true
    ) {
      delete updateData.isDefault;
    }

    const updatedAddress = await addressModel.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update Address Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please provide valid address details",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
};

// --------------------------------------------------
// DELETE ADDRESS
// --------------------------------------------------
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address = await addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await addressModel.deleteOne({
      _id: addressId,
      userId,
    });

    // If default address was deleted,
    // automatically make the newest remaining address default.
    if (wasDefault) {
      const nextAddress = await addressModel
        .findOne({ userId })
        .sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete Address Error:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

// --------------------------------------------------
// SET DEFAULT ADDRESS
// --------------------------------------------------
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    // IMPORTANT:
    // Check ownership before changing anything.
    const address = await addressModel.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove default from all user's addresses
    await addressModel.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );

    // Make selected address default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Set Default Address Error:", error);

    res.status(500).json({
      success: false,
      message: "Error updating default address",
    });
  }
};

export {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};