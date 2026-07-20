import mongoose from "mongoose";

const RegionTimes = {
  Asia: { type: String, default: null },
  EU: { type: String, default: null },
  NA: { type: String, default: null }
};

// Singleton document (there is only ever one "banners" doc, findOneAndUpdate
// with upsert is used everywhere this is touched).
const BannerSchema = new mongoose.Schema(
  {
    key: { type: String, default: "singleton", unique: true },
    currentCharacters: { type: [String], default: [] },
    currentIcons: { type: [String], default: [] },
    currentEnd: RegionTimes,
    nextCharacters: { type: [String], default: [] },
    nextIcons: { type: [String], default: [] },
    nextStart: RegionTimes,
    specialEventName: { type: String, default: null },
    specialEventStart: RegionTimes
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
