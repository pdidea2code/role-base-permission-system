const express = require("express");
const { addRole, changePermission, getAllRole, getRolle, deleteRole, updateRole } = require("../controller/role");
const verifyAppToken = require("../helper/verifyAppToken");
const roleManager = require("../helper/roleManage");
const permissionManage = require("../helper/permissionManage");
const router = express.Router();

router.post("/addRole", verifyAppToken, permissionManage("role.add"), addRole);
router.post("/changePermission", verifyAppToken, permissionManage("role.edit"), changePermission);
router.get("/getAllRole", verifyAppToken, getAllRole);
router.post("/deleteRole", verifyAppToken, permissionManage("role.delete"), deleteRole);
router.post("/updateRole", verifyAppToken, permissionManage("role.edit"), updateRole);
router.get("/getRolle", verifyAppToken, getRolle);

module.exports = router;
