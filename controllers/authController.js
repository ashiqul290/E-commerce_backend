const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// REGISTER
exports.signup = async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    user,
    token: generateToken(user)
  });
};

// LOGIN
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    success: true,
    token: generateToken(user),
    data: user
  });
};