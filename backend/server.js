import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT DB WITH LOG
mongoose
  .connect("mongodb://127.0.0.1:27017/expense-tracker")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ MODEL
const Transaction = mongoose.model(
  "Transaction",
  new mongoose.Schema({
    amount: Number,
    category: String,
    description: String,
    date: Date,
    type: String,
    userId: String,
  })
);

//////////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////////

app.post("/transactions", async (req, res) => {
  try {
    const { amount, type } = req.body;

    const transactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      if (t.type === "expense") totalExpense += t.amount;
    });

    if (type === "expense" && totalExpense + amount > totalIncome) {
      return res.status(400).json({
        message: "Expense cannot be greater than total income",
      });
    }

    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////////

app.put("/transactions/:id", async (req, res) => {
  try {
    const { amount, type } = req.body;

    const transactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t._id.toString() === req.params.id) return;

      if (t.type === "income") totalIncome += t.amount;
      if (t.type === "expense") totalExpense += t.amount;
    });

    if (type === "expense" && totalExpense + amount > totalIncome) {
      return res.status(400).json({
        message: "Expense cannot exceed total income",
      });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////

app.get("/transactions", async (req, res) => {
  const data = await Transaction.find();
  res.json(data);
});

//////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////

app.delete("/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

//////////////////////////////////////////////////////

app.listen(5000, () => console.log("🚀 Server running on port 5000"));