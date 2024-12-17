const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'passenger'],
    default: 'passenger',
  },
  assignedFlights: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
  },
  bookings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  }
});

module.exports = mongoose.model('User', userSchema);