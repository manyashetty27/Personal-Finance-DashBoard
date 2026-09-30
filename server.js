const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// DATABASE
// ===============================

const db = new Database(
    path.join(__dirname, "database", "finance.db")
);


// ===============================
// CREATE TABLES
// ===============================

db.prepare(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        category TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        description TEXT,
        date TEXT NOT NULL
    )
`).run();


db.prepare(`
    CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_amount REAL NOT NULL CHECK(target_amount > 0),
        current_amount REAL DEFAULT 0,
        deadline TEXT
    )
`).run();


// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Personal Finance API is working"
    });

});


// ===============================
// TRANSACTIONS
// ===============================


// GET ALL TRANSACTIONS

app.get("/api/transactions", (req, res) => {

    try {

        const transactions = db.prepare(`
            SELECT *
            FROM transactions
            ORDER BY date DESC, id DESC
        `).all();

        res.json(transactions);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch transactions"
        });

    }

});


// ADD INCOME OR EXPENSE

app.post("/api/transactions", (req, res) => {

    try {

        const {
            type,
            category,
            amount,
            description,
            date
        } = req.body;


        // Validation

        if (!type) {

            return res.status(400).json({
                error: "Transaction type is required"
            });

        }


        if (type !== "income" && type !== "expense") {

            return res.status(400).json({
                error: "Transaction type must be income or expense"
            });

        }


        if (!category) {

            return res.status(400).json({
                error: "Category is required"
            });

        }


        if (!amount || Number(amount) <= 0) {

            return res.status(400).json({
                error: "Amount must be greater than zero"
            });

        }


        if (!date) {

            return res.status(400).json({
                error: "Date is required"
            });

        }


        const result = db.prepare(`
            INSERT INTO transactions
            (
                type,
                category,
                amount,
                description,
                date
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            type,
            category,
            Number(amount),
            description || "",
            date
        );


        res.status(201).json({

            success: true,

            message:
                type === "income"
                    ? "Income added successfully"
                    : "Expense added successfully",

            id: result.lastInsertRowid

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to add transaction"
        });

    }

});


// DELETE TRANSACTION

app.delete("/api/transactions/:id", (req, res) => {

    try {

        const id = Number(req.params.id);

        const result = db.prepare(`
            DELETE FROM transactions
            WHERE id = ?
        `).run(id);


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Transaction not found"
            });

        }


        res.json({

            success: true,

            message: "Transaction deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to delete transaction"
        });

    }

});


// ===============================
// SAVINGS GOALS
// ===============================


// GET GOALS

app.get("/api/goals", (req, res) => {

    try {

        const goals = db.prepare(`
            SELECT *
            FROM savings_goals
            ORDER BY id DESC
        `).all();

        res.json(goals);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to fetch savings goals"
        });

    }

});


// ADD GOAL

app.post("/api/goals", (req, res) => {

    try {

        const {
            name,
            target_amount,
            current_amount,
            deadline
        } = req.body;


        if (!name) {

            return res.status(400).json({
                error: "Goal name is required"
            });

        }


        if (!target_amount || Number(target_amount) <= 0) {

            return res.status(400).json({
                error: "Target amount must be greater than zero"
            });

        }


        const current =
            Number(current_amount) || 0;


        if (current < 0) {

            return res.status(400).json({
                error: "Current amount cannot be negative"
            });

        }


        const result = db.prepare(`
            INSERT INTO savings_goals
            (
                name,
                target_amount,
                current_amount,
                deadline
            )
            VALUES (?, ?, ?, ?)
        `).run(
            name,
            Number(target_amount),
            current,
            deadline || ""
        );


        res.status(201).json({

            success: true,

            message: "Savings goal created successfully",

            id: result.lastInsertRowid

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to create savings goal"
        });

    }

});


// DELETE GOAL

app.delete("/api/goals/:id", (req, res) => {

    try {

        const id = Number(req.params.id);

        const result = db.prepare(`
            DELETE FROM savings_goals
            WHERE id = ?
        `).run(id);


        if (result.changes === 0) {

            return res.status(404).json({
                error: "Savings goal not found"
            });

        }


        res.json({

            success: true,

            message: "Savings goal deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to delete savings goal"
        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log(" Personal Finance Dashboard");
    console.log("======================================");
    console.log(` Server: http://localhost:${PORT}`);
    console.log(` API:    http://localhost:${PORT}/api/test`);
    console.log("======================================");
    console.log("");

});