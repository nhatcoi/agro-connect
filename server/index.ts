import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import esgRoutes from "./routes/esg";
import seasonRoutes from "./routes/season";
import imageRoutes from "./routes/image";
import productRoutes from "./routes/product";
import partnerRoutes from "./routes/partner";
import orderRoutes from "./routes/order";
import qrRoutes from "./routes/qr"; // Added for UC-30
// Database is auto-initialized with simple-db

export function createServer() {
  const app = express();

  // Database is auto-initialized

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Debug middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.use("/api/auth", authRoutes);

  // Profile routes
  app.use("/api/profile", profileRoutes);

      // ESG verification routes
      app.use("/api/esg", esgRoutes);

      // Season management routes
      app.use("/api/season", seasonRoutes);

      // Image upload routes
      app.use("/api/image", imageRoutes);

      // Product management routes
      app.use("/api/product", productRoutes);

      // Partner matching routes
      app.use("/api/partner", partnerRoutes);

      // Order management routes
      app.use("/api/order", orderRoutes);

      // QR code and traceability routes
      app.use("/api/qr", qrRoutes);

      // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  return app;
}
