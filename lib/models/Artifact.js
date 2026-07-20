import mongoose from "mongoose";

const ArtifactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    twoPiece: { type: String, default: "" },
    fourPiece: { type: String, default: "" },
    bestFor: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Artifact ||
  mongoose.model("Artifact", ArtifactSchema);
