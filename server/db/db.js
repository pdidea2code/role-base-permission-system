const mongoose = require("mongoose");
require("dotenv").config();

const database = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Db connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = database;
