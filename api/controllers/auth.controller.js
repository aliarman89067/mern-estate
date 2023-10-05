import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const userDoc = new User({ username, email, password: hashPassword });
  try {
    await userDoc.save();
    console.log("User Created");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
};
