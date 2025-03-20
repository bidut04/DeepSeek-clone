import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk User ID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    tokens: [{ token: String }],
  },
  { timestamps: true }
);

// Generate JWT for internal authentication
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  this.tokens.push({ token });
  this.save();
  return token;
};

// Export User Model
const User = mongoose.model("User", userSchema);
export default User;
