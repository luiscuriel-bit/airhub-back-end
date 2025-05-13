require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
        });
        console.log(`MongoDB successfully connected ${mongoose.connection.name}.`);
    } catch (error) {
        console.error('MongoDB initial connection failed:', error.message);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    };
}

connectDB();

mongoose.connection.on('disconnected', () => {
    console.log(`MongoDB disconnected from database ${mongoose.connection.name}.`);
});

mongoose.connection.on('reconnected', () => {
    console.log(`MongoDB reconnected to database ${mongoose.connection.name}.`);
});

mongoose.connection.on('close', () => {
    console.log(`MongoDB succesfully closed the connection with ${mongoose.connection.name}.`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close(`MongoDB connection closed due to pp termination.`);
    process.exit(0);
});

// Middlewares

const allowedOrigins = [
'http://localhost:5173',
'http://127.0.0.1:5173',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(morgan('dev'))
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const verifyToken = require('./middleware/verify-token');

app.use('/auth', authRoutes);
app.use('/flights', flightRoutes);
app.use(verifyToken);
app.use('/bookings', bookingRoutes);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
})