import mongoose from "mongoose";

const BossSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    drops: { type: String, default: "" },
    guideImages: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.Boss || mongoose.model("Boss", BossSchema);
