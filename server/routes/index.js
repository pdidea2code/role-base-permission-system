const express = require("express");
const router = express.Router();
const authRouter = require("./authRouter");
const roleRouter = require("./roleRouter");
const userRouter = require("./userRouter");

router.use("/", authRouter);
router.use("/role", roleRouter);
router.use("/user", userRouter);

module.exports = router;
