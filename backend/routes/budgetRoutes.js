const express = require("express");
const Budget = require("../models/courses");


const router = express.Router();

// ✅ Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { userId, budgetId, category, customCategory, amount, notes, date } = req.body;
    const newBudget = new Budget({ userId, budgetId, category, customCategory, amount, notes, date});
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const budget = await Budget.find({ userId: req.params.userId });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

router.put("/:budgetId", async (req, res) => {
    try {
      const { category, customCategory, amount, notes } = req.body;
      const updatedBudget = await Budget.findOneAndUpdate(
        { budgetId: req.params.budgetId },
        { category, customCategory, amount, notes, date },
        { new: true, runValidators: true } // Returns updated document and applies validation
      );
  
      if (!updatedBudget) {
        return res.status(404).json({ message: "Budget entry not found" });
      }
  
      res.json(updatedBudget);
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
  
  // ✅ Delete a budget entry
  router.delete("/:budgetId", async (req, res) => {
    try {
      const deletedBudget = await Budget.findOneAndDelete({ budgetId: req.params.budgetId });
  
      if (!deletedBudget) {
        return res.status(404).json({ message: "Budget entry not found" });
      }
  
      res.json({ message: "Budget entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

module.exports = router;

