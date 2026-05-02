const userModel = require('../db/userModel');
const { error, success } = require('../utils/handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json(error(400, "All fields are required"));
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json(error(409, "Email already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json(success(201, "User created successfully"));
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json(error(500, err.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(error(400, "Email and password required"));
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json(error(404, "User not found. Please sign up"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(error(401, "Invalid credentials"));
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key_123",
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret_key_123",
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json(success(200, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    }));
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json(error(500, err.message));
  }
};

const logoutController = (req, res) => {
  return res.status(200).json(success(200, "Logged out successfully"));
};

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json(error(401, "Refresh token is required"));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || "fallback_secret_key_123");
    const user = await userModel.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json(error(403, "Invalid refresh token"));
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key_123",
      { expiresIn: '15m' }
    );

    return res.status(200).json(success(200, { accessToken }));
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json(error(403, "Invalid or expired refresh token"));
  }
};

module.exports = {
  loginController,
  logoutController,
  signupController,
  refreshTokenController,
};