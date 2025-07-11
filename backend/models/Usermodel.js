import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: [
      {
        roadmapslug: String,
        completedResources: [String],
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.matchpass = async function (enteredpass) {
  return await bcrypt.compare(enteredpass, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export const User = mongoose.model("User", UserSchema);
