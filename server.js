require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
        });
        if (process.env.NODE_ENV !== 'production') {
            console.log(`MongoDB successfully connected ${mongoose.connection.name}.`);
        }
    } catch (error) {
        console.error('MongoDB initial connection failed:', error.message);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    };
}

connectDB();

mongoose.connection.on('disconnected', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`MongoDB disconnected from database ${mongoose.connection.name}.`);
    }
});

mongoose.connection.on('reconnected', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`MongoDB reconnected to database ${mongoose.connection.name}.`);
    }
});

mongoose.connection.on('close', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`MongoDB succesfully closed the connection with ${mongoose.connection.name}.`);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close(`MongoDB connection closed due to program termination.`);
    process.exit(0);
});

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
};

// Middlewares
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
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server listening on port ${port}.`);
    }
})