import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

const port =  process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`listening on port ${port}`));
