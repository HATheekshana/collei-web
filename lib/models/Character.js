import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    characterKey: { type: String, required: true, unique: true, index: true },
    imageUrl: { type: String, required: true },
    element: { type: String, default: "" },
    weapon: { type: String, default: "" },
    rarity: { type: Number, default: 5 }
  },
  { timestamps: true }
);

export default mongoose.models.Character ||
  mongoose.model("Character", CharacterSchema);
