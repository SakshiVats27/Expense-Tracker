const userModel = require('../db/userModel');
const { error, success } = require('../utils/handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailSend = require('../utils/emailSend');

const getFrontendUrl = (req) => (process.env.FRONTEND_URL || req.headers.origin || "http://localhost:3000").replace(/\/$/, '');

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

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(error(400, "Email is required"));
    }

    const user = await userModel.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(200).json(success(200, "If an account exists, a password reset link has been sent"));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${getFrontendUrl(req)}/reset-password/${resetToken}`;
    const message = [
      "You requested a password reset for your Expense Tracker account.",
      `Use this link to set a new password: ${resetUrl}`,
      "This link expires in 15 minutes. If you did not request this, you can ignore this email."
    ].join('\n\n');

    try {
      await emailSend({
        email: user.email,
        subject: 'Reset your Expense Tracker password',
        message
      });
    } catch (mailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error("Password reset email error:", mailError);
      return res.status(500).json(error(500, "Could not send reset email. Please try again later."));
    }

    return res.status(200).json(success(200, "If an account exists, a password reset link has been sent"));
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json(error(500, err.message));
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json(error(400, "Reset token and new password are required"));
    }

    if (password.length < 6) {
      return res.status(400).json(error(400, "Password must be at least 6 characters"));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password +passwordResetToken +passwordResetExpires +refreshToken');

    if (!user) {
      return res.status(400).json(error(400, "Password reset link is invalid or has expired"));
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json(success(200, "Password reset successfully. Please log in with your new password"));
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json(error(500, err.message));
  }
};

module.exports = {
  loginController,
  logoutController,
  signupController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
};
