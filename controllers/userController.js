const userModel = require("../models/usesrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// token generator
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// register usesr
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

module.exports = { registerUser };
