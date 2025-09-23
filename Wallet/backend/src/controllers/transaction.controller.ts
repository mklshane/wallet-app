import { sql } from "../config/db.js";
import { Request, Response } from "express";

export const postTransaction = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount === undefined || !user_id || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transaction = await sql`
        INSERT INTO transaction(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export async function getTransactionsByUserId (req: Request, res: Response) {
     try {
       const { userId } = req.params;
       const transactions = await sql`
            SELECT * FROM transaction WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

       res.status(200).json({ transactions });
     } catch (error) {
       console.log("Error fetching the transaction", error);
       return res.status(500).json({ message: "Internal error" });
     }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
        DELETE FROM transaction WHERE id = ${id} RETURNING *
        `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.log("Error deleting transaction", error);
    return res.status(500).json({ message: "Internal error" });
  }
}

export const summary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance FROM transaction WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income FROM transaction 
    WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transaction 
    WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error fetching summary", error);
    return res.status(500).json({ message: "Internal error" });
  }
};