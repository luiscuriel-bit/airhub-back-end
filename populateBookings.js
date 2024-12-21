const mongoose = require('mongoose');
const Booking = require('./models/booking');
const Flight = require('./models/flight');
const User = require('./models/user');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Generate fake bookings
const generateBookings = async () => {
  const bookings = [];
  try {
    const flights = await Flight.find();
    const users = await User.find({ role: 'passenger' }); // Assuming 'passenger' users are in your DB

    if (flights.length === 0 || users.length === 0) {
      throw new Error('No flights or users available to create bookings.');
    }

    for (let i = 0; i < 10; i++) {
      const randomFlight = flights[Math.floor(Math.random() * flights.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      bookings.push({
        flight: randomFlight._id,
        passenger: randomUser._id,
        seatNumber: `Seat-${Math.floor(Math.random() * 100) + 1}`,
        status: 'confirmed',
      });
    }
  } catch (error) {
    console.error('Error generating bookings:', error);
  }
  return bookings;
};

// Populate bookings in the database
const populateBookings = async () => {
  try {
    await Booking.deleteMany(); // Clear the collection
    const bookings = await generateBookings();
    await Booking.insertMany(bookings);
    console.log('Bookings successfully populated.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error populating bookings:', error);
    mongoose.disconnect();
  }
};

populateBookings();