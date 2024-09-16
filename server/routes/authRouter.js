const express = require("express");
const router = express.Router();
const {
  Signup,
  Login,
  RefreshToken,
  checkEmailId,
  verifyOtp,
  changePassword,
  resetPassword,
} = require("../controller/auth");
const { singleFileUpload } = require("../helper/fiileUpload");
const verifyAppToken = require("../helper/verifyAppToken");

router.post(
  "/signup",
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  Signup
);
router.post("/login", Login);
router.post("/refreshToken", RefreshToken);
router.post("/checkEmailId", checkEmailId);
router.post("/verifyOtp", verifyOtp);
router.post("/changePassword", changePassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
