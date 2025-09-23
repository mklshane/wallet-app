import ratelimit from "../config/upstash.js";
import { Request, Response, NextFunction } from "express";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
       // const ip = req.ip ?? "anonymous"; // Use client IP as identifier
        const { success } = await ratelimit.limit("my-rate-limit");

         if (!success) {
           return res
             .status(429)
             .json({ message: "Too many requests, slow down!" });
         }

         next();

    } catch (error) {
      console.error("Rate limiter error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

export default rateLimiter;