const { successResponse, queryErrorRelatedResponse } = require("../helper/sendResponse");
const Role = require("../model/Role");

const addRole = async (req, res, next) => {
  try {
    const { name, insert, update, deletes } = req.body;
    const role = await Role.create({
      name: name,
      insert: insert,
      update: update,
      delete: deletes,
    });

    successResponse(res, role);
  } catch (error) {
    next(error);
  }
};

const getAllRole = async (req, res, next) => {
  try {
    const role = await Role.find();

    successResponse(res, role);
  } catch (error) {
    next(error);
  }
};

const changePermission = async (req, res, next) => {
  try {
    const { name, permission } = req.body;

    if (!name || !permission) {
      return queryErrorRelatedResponse(res, 400, "Name and permission are required.");
    }

    const role = await Role.findOne({ name });

    if (!role) {
      return queryErrorRelatedResponse(res, 404, "Role not found.");
    }

    if (!["insert", "update", "delete"].includes(permission)) {
      return queryErrorRelatedResponse(res, 400, "Invalid permission field.");
    }

    role[permission] = !role[permission];

    await role.save();

    successResponse(res, "Permission updated successfully.", role);
  } catch (error) {
    next(error);
  }
};

module.exports = { addRole, changePermission, getAllRole };
