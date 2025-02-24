import express from "express";
import multer from "multer";
import fs from "fs/promises";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../helpers/cloudinary.js";

const upload = multer({ dest: "uploads/" });

// once file is uploaded to cloudinary :
const deleteLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("Local file deleted successfully");
  } catch (error) {
    console.error("Error deleting local file:", error);
  }
};

const router = express.Router();

// upload single file :
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    console.log(result);

    // after file upload to cloudinary then delete locally saved file from the server or ./uploads folder :
    await deleteLocalFile(req.file.path);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while uploading file!" });
  }

  // Try deleting the local file even if upload fails :
  await deleteLocalFile(req.file?.path);
});

// delete route :
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset Id is missing!",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Assets deleted successfully from cloudinary!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while upldeleting file!" });
  }
});

// bulk upload :
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const result = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      data: result,
      message: "bulk upload successfully!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error occured in bulk upload!",
    });
  }
});

export default router;
