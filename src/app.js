import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// ... (other imports)

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Correct CORS configuration
const corsOptions = {
    // This is the source of the error.
    // The trailing slash must be removed.
    origin: 'https://el-node.vercel.app', 
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