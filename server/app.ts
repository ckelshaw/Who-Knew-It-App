import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";
import answerRoutes from "./routes/answerRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
//app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/users", userRoutes);

export default app;