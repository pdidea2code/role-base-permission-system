const Role = require("../model/Role");
const { queryErrorRelatedResponse } = require("./sendResponse");

const permissionManage = (params) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.user.role);

      if (!role) {
        return queryErrorRelatedResponse(res, 400, "Role not found.");
      }

      switch (params) {
        case "update":
          if (!role.update) {
            return queryErrorRelatedResponse(res, 400, "Invalid Access: Update permission denied.");
          }
          break;

        case "insert":
          if (!role.insert) {
            return queryErrorRelatedResponse(res, 400, "Invalid Access: Insert permission denied.");
          }
          break;

        case "delete":
          if (!role.delete) {
            return queryErrorRelatedResponse(res, 400, "Invalid Access: Delete permission denied.");
          }
          break;

        default:
          return queryErrorRelatedResponse(res, 400, "Invalid Access: Unknown permission type.");
      }

      next();
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      queryErrorRelatedResponse(res, 500, "Internal Server Error.");
    }
  };
};

module.exports = permissionManage;
