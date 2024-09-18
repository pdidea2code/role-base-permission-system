const express = require("express");
const router = express.Router();
const { getUser, addUser, deleteUser, updateUser } = require("../controller/user");
const verifyAppToken = require("../helper/verifyAppToken");
const permissionManage = require("../helper/permissionManage");
const { singleFileUpload } = require("../helper/fiileUpload");

router.post("/getUser", verifyAppToken, getUser);
router.post(
  "/addUser",
  verifyAppToken,
  permissionManage("insert"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 5024, "image"),
  addUser
);
router.post("/deleteUser", verifyAppToken, permissionManage("delete"), deleteUser);
router.post(
  "/updateUser",
  verifyAppToken,
  permissionManage("update"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 5024, "image"),
  updateUser
);

module.exports = router;
