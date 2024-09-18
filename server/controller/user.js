const { queryErrorRelatedResponse, successResponse } = require("../helper/sendResponse");
const Role = require("../model/Role");
const User = require("../model/User");
const deleteFile = require("../helper/deleteFile");
const { use } = require("../routes");

const getUser = async (req, res, next) => {
  try {
    const role = await Role.findOne({ name: req.body.role });

    const user = await User.find({ role: role._id });
    if (!user) return queryErrorRelatedResponse(res, 404, "Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_PROFILE_PATH;
    successResponse(res, user, baseUrl);
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, rolename } = req.body;
    const role = await Role.findOne({ name: rolename });
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: role._id,
      image: req.file ? req.file.filename : null,
    });

    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id });

    if (!user) return queryErrorRelatedResponse(res, 404, "User Not Found");

    if (user.image) {
      deleteFile("profileimg/" + user.image);
    }
    await user.deleteOne({ _id: req.body.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, email, name } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) return queryErrorRelatedResponse(res, 404, "User Not Found");

    email ? (user.email = email) : user.email;
    name ? (user.name = name) : user.user;

    if (req.file && req.file.filename) {
      deleteFile("profileimg/" + user.image);

      user.image = req.file.filename;
    }
    await user.save();

    successResponse(res, "User Update Successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUser,
  addUser,
  deleteUser,
  updateUser,
};
