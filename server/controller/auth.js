const { sendMail } = require("../helper/emailSender");
const { successResponse, createResponse, queryErrorRelatedResponse } = require("../helper/sendResponse");
const Role = require("../model/Role");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const email_URL = process.env.Email_URL;
const crypto = require("crypto");

const Signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userRole = role || "user";

    const roleDoc = await Role.findOne({ name: userRole });
    if (!roleDoc) {
      return res.status(400).json({ message: "Role not found" });
    }

    const user = await User.create({
      name,
      email,
      password,
      image: req.file ? req.file.filename : null,
      role: roleDoc._id,
    });

    createResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).populate("role");
    if (!user) {
      return queryErrorRelatedResponse(res, 400, "Invalid User");
    }

    const Checkpassword = await user.comparePassword(password);
    if (!Checkpassword) {
      return queryErrorRelatedResponse(res, 400, "Invalid Password");
    }

    const token = await user.generateAuthToken({ email: user.email });
    const refreshToken = await user.generateRefreshToken({ email: user.email });
    user.token = token;
    await user.save();

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_PROFILE_PATH;
    const data = {
      user,
      token,
      refreshToken,
    };
    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Access Denied. No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return queryErrorRelatedResponse(res, 401, "Invalid User!");
    }

    const accessToken = user.generateAuthToken({ email: user.email });

    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");

    const resetCode = crypto.randomBytes(32).toString("hex");
    user.expireOtpTime = Date.now() + 15 * 60 * 1000;
    const resetLink = `${email_URL}resetpassword/${resetCode}/${user._id}`;

    sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      sub: "Dish Discover - Forgot Password",
      htmlFile: "./views/forgotpassword.html",
      extraData: {
        resetLink: resetLink,
      },
    });
    user.resetCode = resetCode;
    await user.save();

    successResponse(res, "OTP send successfully");
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id, resetCode: req.body.resetCode });

    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid Detail");

    if (user.expireOtpTime < Date.now()) {
      return queryErrorRelatedResponse(res, 401, "Link is Expired!");
    }

    successResponse(res, "Link verified");
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { id, resetCode, password, confpassword } = req.body;

    const user = await User.findOne({ _id: id, resetCode: resetCode });
    if (!user) return queryErrorRelatedResponse(res, 401, "User Not Found");
    if (confpassword !== password) {
      return queryErrorRelatedResponse(res, 400, "Confirm password not matche");
    }
    user.password = password;
    user.resetCode = null;
    await user.save();
    successResponse(res, "password change successfully");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, new_password, confirm_password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return queryErrorRelatedResponse(res, 401, "user Not Found");

    const verifyPassword = await user.comparePassword(password);
    if (!verifyPassword) return queryErrorRelatedResponse(res, 401, "Invalid Old Password");

    if (new_password !== confirm_password) {
      return queryErrorRelatedResponse(res, 404, "Confirm password does not match.");
    }

    user.password = new_password;

    await user.save();
    successResponse(res, "Password changed successfully!");
  } catch (error) {
    next(error);
  }
};

module.exports = { Signup, Login, RefreshToken, checkEmailId, verifyOtp, changePassword, resetPassword };
