import mongoose, { Schema } from "mongoose";
const ResourceSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["article", "video", "both"], required: true },
  linka: { type: String, required: true },
  linkb: { type: String, required: true },
});
const RoadmapSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    resources: [ResourceSchema],
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
