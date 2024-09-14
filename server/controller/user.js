const { queryErrorRelatedResponse, successResponse } = require("../helper/sendResponse");
const Role = require("../model/Role");
const User = require("../model/User");

const getUser = async (req, res, next) => {
  try {
    const role = await Role.findOne({ name: "user" });
    const user = await User.find({ role: role._id });
    if (!user) return queryErrorRelatedResponse(res, 404, "Not Found");

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BASE_URL_PROFILE_PATH;
    successResponse(res, user, baseUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
};
