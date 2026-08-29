 const express = require("express");
const router = express.Router();
const multer = require("multer");

const Complaint = require("../models/Complaint");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// ================= IMAGE UPLOAD SETUP =================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ================= CREATE COMPLAINT =================
// Logged-in user

router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageUrl = req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "";

      const complaint = new Complaint({
        ...req.body,
        imageUrl,
      });

      await complaint.save();

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error submitting complaint",
        error: error.message,
      });
    }
  }
);

// ================= GET ALL COMPLAINTS =================
// Public

router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaints",
      error: error.message,
    });
  }
});

// ================= UPDATE STATUS =================
// Admin only

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.status(200).json({
        message: "Status updated successfully",
        complaint,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating complaint",
        error: error.message,
      });
    }
  }
);

// ================= DELETE COMPLAINT =================
// Admin only

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findByIdAndDelete(req.params.id);

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.status(200).json({
        message: "Complaint deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting complaint",
        error: error.message,
      });
    }
  }
);

module.exports = router;