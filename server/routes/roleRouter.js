const express = require("express");
const { addRole, changePermission, getAllRole } = require("../controller/role");
const verifyAppToken = require("../helper/verifyAppToken");
const roleManager = require("../helper/roleManage");
const router = express.Router();

router.post("/addRole", verifyAppToken, roleManager, addRole);
router.post("/changePermission", verifyAppToken, roleManager, changePermission);
router.get("/getAllRole", verifyAppToken, roleManager, getAllRole);

module.exports = router;
