const express = require("express");
const router = express.Router();
const { getUser } = require("../controller/user");
const verifyAppToken = require("../helper/verifyAppToken");

router.get("/getUser", verifyAppToken, getUser);

module.exports = router;
