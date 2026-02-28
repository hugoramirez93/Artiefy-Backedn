import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Evita recompilar el modelo en hot reload
export default models.User || model("User", UserSchema);
