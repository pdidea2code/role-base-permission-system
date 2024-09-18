const express = require("express");
const { addRole, changePermission, getAllRole, getRolle, deleteRole, updateRole } = require("../controller/role");
const verifyAppToken = require("../helper/verifyAppToken");
const roleManager = require("../helper/roleManage");
const router = express.Router();

router.post("/addRole", verifyAppToken, roleManager, addRole);
router.post("/changePermission", verifyAppToken, roleManager, changePermission);
router.get("/getAllRole", verifyAppToken, roleManager, getAllRole);
router.post("/deleteRole", verifyAppToken, roleManager, deleteRole);
router.post("/updateRole", verifyAppToken, roleManager, updateRole);
router.get("/getRolle", verifyAppToken, getRolle);

module.exports = router;
