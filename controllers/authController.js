const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_LENGTH = 12;

const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use.' });
    }

    const user = await User.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, SALT_LENGTH),
    });

    const token = jwt.sign({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token, message: 'Registration successful.' });
  } catch (error) {
    res.status(500).json({ message: 'An error ocurred during registration.' });
  }
};

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
        process.env.JWT_SECRET
      );

      res.status(200).json({ token, message: 'Login successful.' });
    }
    else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error ocurred during login.' });
  }
};

module.exports = { signup, signin };