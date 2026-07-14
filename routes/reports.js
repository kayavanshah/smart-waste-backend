const express = require("express");
const cloudinary = require("cloudinary").v2;
const Report = require("../models/Report");
const { protect, admin } = require("../middleware/auth");
const { verifyWasteImage } = require("../services/ai");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", protect, async (req, res) => {
  try {
    const { imageBase64, location, details } = req.body;

    if (!imageBase64 || !location || !location.lat || !location.lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const aiResult = await verifyWasteImage(base64Data);

    if (!aiResult.isGarbage) {
      return res.status(400).json({ error: "Image does not appear to contain valid waste/garbage.", aiResult });
    }

    const report = await Report.create({
      user: req.user._id,
      imageUrl: imageBase64, // Saving directly to MongoDB as Base64 to bypass Cloudinary
      location,
      status: "Pending",
      aiValidation: aiResult,
      details,
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Report submission error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    let reports;
    if (req.user.role === "admin") {
      reports = await Report.find().populate("user", "name email").sort({ createdAt: -1 });
    } else {
      reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedReport = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({ message: "Report updated", report: updatedReport });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
