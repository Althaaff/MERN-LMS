import express from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/auth-controller/index.js";
import { authenticateMiddleware } from "../../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;
  console.log("user :", user);

  return res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

export default router;
