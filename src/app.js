import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => { res.send("El-Node Inventory API is running") });

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});