const asynsHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asynsHandler(async (req, res) => {
  const { username, email, number } = req.body;
  if (!username || !email || !number) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({
      message: "User already registered!",
      status: false,
    });
  }

  const user = await User.create({
    username,
    email,
    number,
  });
  console.log(`user created ${user}`);

  if (user) {
    res.status(201).json({
      data: {
        _id: user.id,
        email: user.email,
        username: user.username,
        number: user.number,
      },
      message: "User data sent successfully",
      status: true,
    });
  } else {
    res.status(400);
    throw new Error("user data not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public

const loginUser = asynsHandler(async (req, res) => {
  const { number } = req.body;
  if (!number) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ number });

  // compare password with hashedpassword
  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          number: User.number,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({
      data: {
        access_token: accessToken,
        _id: user.id,
        email: user.email,
        username: user.username,
        number: user.number,
      },
      message: `Welcome back ${user.username}`,
      status: true,
    });
  } else {
    res
      .status(401)
      .json({ message: "email or password is not vaild ", status: false });
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private

const currentUser = asynsHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
