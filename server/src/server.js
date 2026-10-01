const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");


const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth" , authRoutes);
app.use("/api" , transactionRoutes);
app.use("/api" , accountRoutes);

app.use(errorHandler);


const startServer = async() => {
    await connectDB();

    app.listen(PORT , () => {
        console.log(`Server running on ${PORT}`);
    });
}

startServer();