import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import auditlogRoutes from "./routes/auditlogRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// --- START: MODIFIED CORS CONFIGURATION ---

// 1. Define your allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Your local development frontend
  'https://el-node-module1.vercel.app', // Your deployed frontend
  'https://www.elims.in'
];

// 2. Create CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // This allows cookies to be sent
};

// 3. Use the new CORS options
app.use(cors(corsOptions));

// --- END: MODIFIED CORS CONFIGURATION ---


// Increase the body limit for JSON payloads to handle base64 images
app.use(express.json({ limit: '5mb' }));


app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auditlogs", auditlogRoutes);

app.get("/", (req, res) => { res.send("El-Node Inventory API is running") });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
