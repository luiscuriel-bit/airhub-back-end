const mongoose = require('mongoose');
const Flight = require('./models/flight');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Generate fake flights
const generateFlights = () => {
  const flights = [];
  for (let i = 0; i < 10; i++) {
    flights.push({
      flightNumber: `FL${1000 + i}`,
      origin: `City${i}`,
      destination: `City${i + 1}`,
      departureTime: new Date(Date.now() + i * 3600000),
      arrivalTime: new Date(Date.now() + (i + 2) * 3600000),
      availableSeats: Math.floor(Math.random() * 200 + 50),
      status: 'scheduled',
      price: Math.floor(Math.random() * 300 + 50),
    });
  }
  return flights;
};

// Populate flights in the database
const populateFlights = async () => {
  try {
    await Flight.deleteMany(); // Clear the collection
    const flights = generateFlights();
    await Flight.insertMany(flights);
    console.log('Flights successfully populated.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error populating flights:', error);
    mongoose.disconnect();
  }
};

populateFlights();