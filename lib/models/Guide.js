import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    characterKey: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Guide || mongoose.model("Guide", GuideSchema);
