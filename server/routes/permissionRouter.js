const express = require("express");
const { addPermission, getPermissions, deletePermission } = require("../controller/permission");
const verifyAppToken = require("../helper/verifyAppToken");
const permissionManage = require("../helper/permissionManage");
const router = express.Router();

// Add Permission
router.post("/addPermission", verifyAppToken, permissionManage("permission.add"), addPermission);

// Get All Permissions
router.get("/permissions", verifyAppToken, permissionManage("permission.view"), getPermissions);

// Delete Permission
router.delete("/deletePermission/:id", verifyAppToken, permissionManage("permission.delete"), deletePermission);

module.exports = router;
