import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorMiddleware';

// Routes
import authRoutes from './routes/authRoutes';
import flightRoutes from './routes/flightRoutes';
import bookingRoutes from './routes/bookingRoutes';
import verifyToken from './middleware/verify-token';

const app = express();

// MongoDB connection
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            retryWrites: true,
        });
        if (process.env.NODE_ENV !== 'production') {
            console.log(`MongoDB successfully connected ${mongoose.connection.name}.`);
        }
    } catch (error: any) {
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
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to program termination.');
    process.exit(0);
});

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/flights', flightRoutes);
app.use(verifyToken as any);
app.use('/bookings', bookingRoutes);

// Error Middleware (Must be last)
app.use(globalErrorHandler);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server listening on port ${port}.`);
    }
});