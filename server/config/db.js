// import mongoose from "mongoose";
// // Function to connect to the MongoDB database
// const connectDB = async () => {
//   try {
//     mongoose.set('strictQuery', true);
//     // Connection to MongoDB
//     const res = await mongoose.connect(
//       process.env.MONGODB_CLIENT
//     );

//     // Log success message if connected
//     if (res) {
//       console.log("Connected to MongoDB successfully");
//     }
//   } catch (error) {
//     // Log error message if connection fails
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1); // Exit the application if the connection fails
//   }
// };

// export default connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    
    // Connection to MongoDB using the URI from the environment variable
    await mongoose.connect(process.env.MONGODB_CLIENT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully"); // Log success message if connected

  } catch (error) {
    console.error("MongoDB connection failed:", error.message); // Log error message if connection fails
    process.exit(1); // Exit the application if the connection fails
  }
};

export default connectDB;
