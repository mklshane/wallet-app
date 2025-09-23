import express from "express"
import { sql } from "../config/db.js";
import { deleteTransaction, getTransactionsByUserId, postTransaction, summary } from "../controllers/transaction.controller.js";

const router = express.Router()

router.post("/", postTransaction);

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", summary);

export default router;