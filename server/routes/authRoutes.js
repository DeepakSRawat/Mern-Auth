import express from "express";
import {
  isVerified,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  sendResetOTP,
  verifyEmail,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-otp", userAuth, sendOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isVerified);
authRouter.post("/reset-password-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
