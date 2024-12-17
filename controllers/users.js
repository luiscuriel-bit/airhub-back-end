const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_LENGTH = 12;

exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use.' });
    }

    const user = new User({
      ...req.body, password: bcrypt.hashSync(req.body.password, SALT_LENGTH)
    });
    await user.save();

    const token = jwt.sign({
      username: user.username, role: user.role, _id: user._id
    },
      process.env.JWT_SECRET
    );

    res.status(201).json({ user, token, message: 'Registration successful.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({
        username: user.username, role: User.role, _id: user._id
      },
        process.env.JWT_SECRET
      );
      res.status(201).json({ user, token, message: 'Login successful.' });
    }
    else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};