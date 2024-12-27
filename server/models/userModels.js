import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: "String", required: true },
  email: { type: "String", required: true, unique: true },
  password: { type: "String", required: true },
  verifiedOTP: { type: "String", default: "" },
  verifiedOTPExpiresAt: { type: "Number", default: 0 },
  userVerified: { type: "Boolean", default: false },
  resetOTP: { type: "String", default: "" },
  resetOTPExpiresAt: { type: "Number", default: 0 },
});

const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;
