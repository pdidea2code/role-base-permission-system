const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 8080;
const database = require("./db/db");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database();

const route = require("./routes");
app.use(route);

app.use((err, req, res, next) => {
  console.error("Error log:", err);
  if (err.code && err.code === 11000) {
    err.message = `Duplicate key error: ${Object.keys(err.keyValue)[0]} with value '${
      Object.values(err.keyValue)[0]
    }' already exists.`;
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    success: false,
    message: err.message || "An unexpected error occurred.",
  });
});

app.use("/public/profileimg", express.static(path.join(__dirname, "./public/profileimg")));

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
