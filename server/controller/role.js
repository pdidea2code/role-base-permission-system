const deleteFile = require("../helper/deleteFile");
const { successResponse, queryErrorRelatedResponse } = require("../helper/sendResponse");
const Role = require("../model/Role");
const User = require("../model/User");

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

const getRolle = async (req, res, next) => {
  try {
    const role = await Role.findOne({ _id: req.user.role });
    if (!role) return queryErrorRelatedResponse(res, 400, "Invalid Role");

    successResponse(res, role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.body.id);
    if (!role) return queryErrorRelatedResponse(res, 404, "Role Not Found");

    const users = await User.find({ role: req.body.id });
    const user = await Promise.all(
      users.map(async (data) => {
        if (data.image) {
          deleteFile("profileimg/" + data.image);
        }
        await User.deleteOne(data._id);
      })
    );

    await Role.deleteOne({ _id: req.body.id });
    successResponse(res, "delete Successfully");
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.body.id);
    if (!role) return queryErrorRelatedResponse(res, "Role Not Found");

    req.body.name ? (role.name = req.body.name) : role.name;
  } catch (error) {
    next(error);
  }
};

module.exports = { addRole, changePermission, getAllRole, getRolle, deleteRole, updateRole };
