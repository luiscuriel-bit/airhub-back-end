require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



app.use(cors());
app.use(express.json());



const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}.`);
})