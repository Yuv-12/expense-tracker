import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URI starts with:", process.env.MONGO_URI?.slice(0, 20));
const app = express();
app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// ✅ CONNECT DB
//////////////////////////////////////////////////////

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expense-tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1); // Exit if DB connection fails
  });

//////////////////////////////////////////////////////
// ✅ MODEL
//////////////////////////////////////////////////////

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: 'Type must be either "income" or "expense"',
      },
      required: [true, "Type is required"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true, // faster queries by userId
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Transaction = mongoose.model("Transaction", transactionSchema);

//////////////////////////////////////////////////////
// ✅ HELPERS
//////////////////////////////////////////////////////

// Calculate totals excluding a specific transaction ID (used during updates)
async function calcTotals(userId, excludeId = null) {
  const transactions = await Transaction.find({ userId });
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (excludeId && t._id.toString() === excludeId) return;
    if (t.type === "income") totalIncome += t.amount;
    if (t.type === "expense") totalExpense += t.amount;
  });

  return { totalIncome, totalExpense };
}

// Validate required fields on create/update
function validateTransactionBody(body) {
  const { amount, type, category, userId } = body;
  const errors = [];

  if (!userId) errors.push("userId is required");
  if (!type || !["income", "expense"].includes(type))
    errors.push('type must be "income" or "expense"');
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    errors.push("amount must be a positive number");
  if (!category || category.trim() === "")
    errors.push("category is required");

  return errors;
}

//////////////////////////////////////////////////////
// 🔥 CREATE TRANSACTION
//////////////////////////////////////////////////////

app.post("/transactions", async (req, res) => {
  try {
    const errors = validateTransactionBody(req.body);
    if (errors.length > 0)
      return res.status(400).json({ message: errors.join(", ") });

    const { type, userId } = req.body;
    const amt = Number(req.body.amount);

    if (type === "expense") {
      const { totalIncome, totalExpense } = await calcTotals(userId);
      if (totalExpense + amt > totalIncome) {
        return res.status(400).json({
          message: "Expense cannot exceed total income",
        });
      }
    }

    const newTransaction = new Transaction({ ...req.body, amount: amt });
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("POST /transactions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// 🔥 UPDATE TRANSACTION
//////////////////////////////////////////////////////

app.put("/transactions/:id", async (req, res) => {
  try {
    const errors = validateTransactionBody(req.body);
    if (errors.length > 0)
      return res.status(400).json({ message: errors.join(", ") });

    const { type, userId } = req.body;
    const amt = Number(req.body.amount);

    if (type === "expense") {
      const { totalIncome, totalExpense } = await calcTotals(
        userId,
        req.params.id
      );
      if (totalExpense + amt > totalIncome) {
        return res.status(400).json({
          message: "Expense cannot exceed total income",
        });
      }
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId },
      { ...req.body, amount: amt },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(403)
        .json({ message: "Transaction not found or not allowed" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /transactions/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// 🔥 GET USER TRANSACTIONS
//////////////////////////////////////////////////////

app.get("/transactions", async (req, res) => {
  try {
    const { userId } = req.query; // changed from URL param to query param

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const data = await Transaction.find({ userId }).sort({ date: -1 }); // newest first

    res.json(data);
  } catch (err) {
    console.error("GET /transactions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// 🔥 DELETE TRANSACTION
//////////////////////////////////////////////////////

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deleted) {
      return res
        .status(403)
        .json({ message: "Transaction not found or not allowed" });
    }

    res.json({ message: "Deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("DELETE /transactions/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//////////////////////////////////////////////////////
// ✅ 404 HANDLER
//////////////////////////////////////////////////////

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

//////////////////////////////////////////////////////
// ✅ START SERVER
//////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));