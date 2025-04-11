import Order from "../models/order.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});
