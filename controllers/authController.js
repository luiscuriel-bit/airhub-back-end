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
      lastName: user.lastName, // I added the last name and email here so it could be included in the profile page
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
        lastName: user.lastName, // I added the last name and email here so it could be included in the profile page
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


//This is for the profile update endpoint.
const updateUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email } = req.body;
    const userId = req.user._id; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'An error occurred while updating user profile.' });
  }
};

//This is to change the password from the profile
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    user.password = bcrypt.hashSync(newPassword, SALT_LENGTH);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ message: 'An error occurred while changing the password.' });
  }
};

module.exports = { signup, signin, updateUser, changePassword };
