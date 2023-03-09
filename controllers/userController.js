const userModel = require("../models/usesrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");

// token generator
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// register usesr
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(400).json("Email already registered");
    }

    // blank fiels validation
    if (!name || !email || !password) {
      return res.status(400).json("Blank fields are required");
    }

    // email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid Email");
    }

    // password validation
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json(
          "Password must be contain UPPRECASE, LOWERCASE, NUMBER, SYMBLE and 8+ Chars"
        );
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // if all ok then create an user
    const user = await userModel.create({ name, email, password: hash });

    // create token
    const token = createToken(user._id);
    res
      .status(200)
      .json({ _id: user._id, name, email, password: user.password, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      return res.status(400).json("Invalid email or password");
    }

    // password authentication
    const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
      return res.status(400).json("Incorrect password");
    }

    // create token
    const token = createToken(existUser._id);
    res.status(200).json({
      _id: existUser._id,
      name: existUser.name,
      email,
      password: existUser.password,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// search user
const findUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("Invalid Id");
  }
  try {
    const existUser = await userModel.findById(userId);
    res.status(200).json(existUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// gset all users
const geteAllUsers = async (req, res) => {
  try {
    const usesr = await userModel.find({});

    res.status(200).json(usesr);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { registerUser, loginUser, findUser, geteAllUsers };
