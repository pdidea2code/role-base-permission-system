const express = require("express");
const { addRole, changePermission, getAllRole, getRolle } = require("../controller/role");
const verifyAppToken = require("../helper/verifyAppToken");
const roleManager = require("../helper/roleManage");
const router = express.Router();

router.post("/addRole", verifyAppToken, roleManager, addRole);
router.post("/changePermission", verifyAppToken, roleManager, changePermission);
router.get("/getAllRole", verifyAppToken, roleManager, getAllRole);
router.get("/getRolle", verifyAppToken, getRolle);

module.exports = router;
