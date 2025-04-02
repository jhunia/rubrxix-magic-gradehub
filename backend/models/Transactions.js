const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true, // Each transaction must be linked to a user
    },
    transactionId: {
      type: String,
      required: true, // Each transaction must be linked to a user
    },
    type: {
      type: String,
      enum: ["income", "expense"], // Ensures only valid values
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Income","Housing", "Food & Dining", "Transportation", "Utilities",
        "Entertainment", "Shopping", "Health & Fitness", "Personal Care",
        "Education", "Travel", "Debt Payments", "Savings", "Gifts & Donations",
        "Subscriptions", "Other"
      ],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    date: { type: Date, required: true, default: Date.now },
    account: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
