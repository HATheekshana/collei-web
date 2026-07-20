import mongoose from "mongoose";

// One document per mode: "abyss" | "theatre" | "stygian"
const RegionTimes = {
  Asia: { type: String, default: null },
  EU: { type: String, default: null },
  NA: { type: String, default: null }
};

const EndgameSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      required: true,
      unique: true,
      enum: ["abyss", "theatre", "stygian"]
    },
    label: { type: String, required: true },
    // ISO timestamps (UTC). "current" window ends at currentEnd, "next" window
    // starts at nextStart. Region offsets are applied on the frontend/API,
    // mirroring how the bot converts the Asia timestamp to EU/NA reset times.
    currentEnd: RegionTimes,
    nextStart: RegionTimes,
    currentImages: { type: [String], default: [] },
    nextImages: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.Endgame ||
  mongoose.model("Endgame", EndgameSchema);
