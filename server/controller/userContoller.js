import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        userVerified: user.userVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message + " at getUserData" });
  }
};
