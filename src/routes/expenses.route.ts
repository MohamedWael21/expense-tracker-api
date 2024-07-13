import express from "express";
import {
  addExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  getExpensesByPastDate,
  getExpensesByStartAndEndDate,
  updateExpense,
} from "../controllers/expenses.controller";
import isAuth from "../middleware/isAuth";

const router = express.Router();
router.use(isAuth);
router.route("/").get(getExpenses).post(addExpense);

router.get("/:startDate/:endDate", getExpensesByStartAndEndDate);
router.get("/:pastDate", getExpensesByPastDate);

router.route("/:expenseId").get(getExpense).delete(deleteExpense).patch(updateExpense);

export default router;
