import { User } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // check if user already exist :
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "username and user email already exists!",
      });
    }

    // hashing password:
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: false,
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || (await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // generating the access token :
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "120m" }
    );

    // sends the response :
    return res.status(201).json({
      success: true,
      message: "Login successfully!",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
