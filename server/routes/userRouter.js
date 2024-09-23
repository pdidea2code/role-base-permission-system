const express = require("express");
const router = express.Router();
const { getUser, addUser, deleteUser, updateUser } = require("../controller/user");
const verifyAppToken = require("../helper/verifyAppToken");
const permissionManage = require("../helper/permissionManage");
const { singleFileUpload } = require("../helper/fiileUpload");

router.post("/getUser", verifyAppToken, permissionManage("user.view"), getUser);
router.post("/getDashbord", verifyAppToken, permissionManage("dashboard.view"), getUser);
router.post(
  "/addUser",
  verifyAppToken,
  permissionManage("user.add"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 5024, "image"),
  addUser
);
router.post("/deleteUser", verifyAppToken, permissionManage("user.delete"), deleteUser);
router.post(
  "/updateUser",
  verifyAppToken,
  permissionManage("user.edit"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 5024, "image"),
  updateUser
);

module.exports = router;
