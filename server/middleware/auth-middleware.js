import jwt from "jsonwebtoken";

export const authenticateMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  console.log("auth headers :", authHeaders);

  const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
  };

  if (!authHeaders) {
    return res.status(401).json({
      success: false,
      message: "user is not authenticated!",
    });
  }

  const token = authHeaders.split(" ")[1];

  // this below payload contains user data :
  const payload = verifyToken(token, process.env.JWT_SECRET);

  req.user = payload;

  console.log("user: ", req.user);

  next();
};
