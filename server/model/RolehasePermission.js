const mongoose = require("mongoose");

const RolehasePermissionSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "role",
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "permission",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("rolehasepermission", RolehasePermissionSchema);
