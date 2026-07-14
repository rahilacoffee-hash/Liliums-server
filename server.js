import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./route/user.route.js";
import productRouter from "./route/product.route.js";
import orderRouter from "./route/Order.route.js";
import cartRouter from "./route/Cart.route.js";
import paymentRouter from "./route/Payment.route.js";

const app = express();
const PORT = process.env.PORT || 8080;

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://liliums-glee.vercel.app",
    ],
    credentials: true,
  })
);

// --------------------
// Cookies
// --------------------
app.use(cookieParser());

// --------------------
// Paystack Webhook
// Must come BEFORE express.json()
// --------------------
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// --------------------
// JSON Parser
// --------------------
app.use(express.json());

// --------------------
// Routes
// --------------------
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);

// --------------------
// Health Check
// --------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// --------------------
// MongoDB
// --------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDB();

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});