const express = require("express");
const router = express.Router();
const authRouter = require("./authRouter");
const roleRouter = require("./roleRouter");
const userRouter = require("./userRouter");
const permissionRouter = require("./permissionRouter");

router.use("/", authRouter);
router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/permission", permissionRouter);

module.exports = router;
