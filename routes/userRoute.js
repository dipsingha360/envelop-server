const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  geteAllUsers,
} = require("../controllers/userController");

// router
const router = express.Router();

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/find/:userId", findUser);
router.get("/", geteAllUsers);

module.exports = router;
