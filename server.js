require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const verifyToken = require('./middleware/verify-token');


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



app.use(cors());
app.use(express.json());



app.use('/auth', authRoutes);
app.use('/flights', flightRoutes);

app.use(verifyToken);
app.use('/bookings', bookingRoutes);



const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}.`);
})