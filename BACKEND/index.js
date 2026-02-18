const express = require('express');
const dotenv= require('dotenv');
const cors = require('cors');
const connectDB = require('./Src/Config/dbconnect');
const authRoutes = require('./Src/Routes/authRoutes');
const userRoutes = require('./Src/Routes/userRoutes');

connectDB();
const app = express();

app.use(express.json());
dotenv.config();

// Enable CORS
app.use(cors());


//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);


//Start the server
const PORT = process.env.PORT||5000; ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

