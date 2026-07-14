const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    aiValidation: {
      isGarbage: Boolean,
      confidence: Number,
      message: String,
    },
    details: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
