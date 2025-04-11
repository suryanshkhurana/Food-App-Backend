import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemID: String,
      itemName: String,
      price: Number,
      quantity: Number,
    }
  ],
  address: { type: String, required: true },
  totalAmount: Number,
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
