import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import nftRoutes from "./routes/nftRoutes.js";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();

//setup my middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/api/nfts", nftRoutes);

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "https://nft-mint-app-delta.vercel.app",
    "https://nft-mint-app.onrender.com/api/nfts", // Allow frontend to communicate
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "NFTMINT API",
      version: "1.0.0",
      description: "API documentation for NFT minting",
    },
    servers: [{ url: "https://nft-mint-app.onrender.com" }],
  },
  apis: ["./routes/*.js"], // Path to API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
