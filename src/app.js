import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Correct CORS configuration
const corsOptions = {
    // Replace the URL below with the exact URL of your deployed frontend.
    // This allows only your frontend to access the API.
    origin: 'https://your-frontend-domain.vercel.app', 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => { res.send("El-Node Inventory API is running") });

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});