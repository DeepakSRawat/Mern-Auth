import userModel from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_USER,
} from "../config/emailTemplates.js";

const SiteName = "mern auth practice";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailData = {
      from: process.env.SENDER_EMAIL_ID,
      to: email,
      subject: `Welcome to ${SiteName}`,
      html: WELCOME_USER.replace("{{user}}", user.name),
    };

    await transporter.sendMail(mailData);

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "required details for login is incomplete",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User with this email is not registered yet.",
      });
    }
    // console.log("user: ", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "user is login successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "user is logout successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { userId } = req.body;
  // console.log("userId: ", userId);
  try {
    const user = await userModel.findOne({ _id: userId });
    if (user.userVerified) {
      return res.json({ success: false, message: "user is already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    // console.log("generated otp: ", otp);
    user.verifiedOTP = otp;
    user.verifiedOTPExpiresAt = Date.now() + 24 * 60 * 1000;
    await user.save();

    const mailData = {
      from: process.env.SENDER_EMAIL_ID,
      to: user.email,
      subject: "user OTP Verification",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailData);
    return res.json({
      success: true,
      message: "user verify otp is send successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message + " at sendOTP" });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }
    if (user.verifiedOTP !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifiedOTPExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.userVerified = true;
    user.verifiedOTP = "";
    user.verifiedOTPExpiresAt = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isVerified = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is verified" });
  } catch (error) {
    res.json({ success: false, message: error.message + " at isVerified" });
  }
};

// password reset otp
export const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Please enter email" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    // console.log("user: ", user);

    const mailData = {
      from: process.env.SENDER_EMAIL_ID,
      to: user.email,
      subject: "user OTP Verification",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailData);

    return res.json({
      success: true,
      message: "password reset otp is send successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message + " at password reset otp",
    });
  }
};

// verify password reset otp
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (otp == "" || user.resetOTP !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOTPExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = "";
    user.resetOTPExpiresAt = 0;
    await user.save();

    return res.json({ success: true, message: "password reset successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message + " at verify password reset otp",
    });
  }
};
