import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;
  // console.log("token: ", token);
  if (!token) {
    return res.json({ success: false, message: "Not Authorized at userAuth" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
      next();
    } else {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again. at tokenDecode",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
