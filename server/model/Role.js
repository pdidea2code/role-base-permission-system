const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
      unique: true,
    },

    insert: {
      type: Boolean,
      defaultL: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("role", RoleSchema);
