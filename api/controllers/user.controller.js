import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only change you profile"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token").json("Account deleted Successfully !");
  } catch (error) {
    next(error);
  }
};
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const userListings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(userListings);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You can only view your own listings!"));
  }
};
