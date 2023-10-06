import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  try {
    await User.create({ username, email, password: hashPassword });
    res.json("User Created");
  } catch (err) {
    next(err);
  }
};
