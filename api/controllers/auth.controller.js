import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const userDoc = new User({ username, email, password: hashPassword });
  try {
    await userDoc.save();
    console.log("User Created");
  } catch (err) {
    next(err);
  }
};
