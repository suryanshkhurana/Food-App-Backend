import express from "express";
import Order from "../models/order.models.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserOrders } from "../controllers/order.controller.js";
import { sendOrderConfirmationMail } from "../utils/mailer.js";


const router = express.Router();

router.post("/", verifyJWT, async (req, res) => {
    try {
      const { items, address } = req.body;
      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
      const newOrder = await Order.create({
        userId: req.user._id,
        items,
        address,
        totalAmount: total * 1.02,
      });
  
      console.log("Calling mailer with:", req.user.email);
      console.log("Order ID:", newOrder._id);
  
      try {
        const info = await sendOrderConfirmationMail(req.user.email, newOrder);
        console.log("Email sent! Message ID:", info.messageId);
      } catch (emailError) {
        console.error(" Failed to send email:", emailError.message);
      }
  
      res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
      console.error(" Error in placing order:", err.message);
      res.status(500).json({ success: false, message: "Failed to place order" });
    }
  });
  
  
router.get("/", verifyJWT, getUserOrders);

export default router;
