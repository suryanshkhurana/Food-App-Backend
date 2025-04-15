import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { adminRouter } from "./admin.js";
import { getProducts } from "./controllers/products.controller.js";

const app = express();

// Apply CORS middleware first
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://food-app-pi-one.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static file serving
app.use(express.static("public"));

// Cookie parser middleware
app.use(cookieParser());

// Setup AdminJS before body-parser middleware
app.use('/admin', adminRouter);

// Only after AdminJS, apply body-parser middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", getProducts);
app.use("/api/v1/orders", orderRoutes);

export { app };