import { catchAsyncError, createFilteredQuery, getPastDateFromFilteredQuery } from "../lib/utils";
import * as expensesService from "../services/expenses.service";

export const getExpenses = catchAsyncError(async (req, res, _) => {
  const expenses = await expensesService.getExpensesFor(req.userId!);

  res.status(200).json({
    status: "success",
    data: {
      expenses,
    },
  });
});

export const addExpense = catchAsyncError(async (req, res, _) => {
  const { amount, pay_at, category } = req.body;
  const pay_at_date = new Date(pay_at);
  const newExpense = await expensesService.addExpenseFor(req.userId!, { amount, pay_at: pay_at_date, category });

  res.status(200).json({
    status: "success",
    data: {
      newExpense,
    },
  });
});

export const getExpense = catchAsyncError(async (req, res, _) => {
  const expense = await expensesService.getExpenseFor(req.userId!, Number(req.params.expenseId));

  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

export const deleteExpense = catchAsyncError(async (req, res, _) => {
  const expense = await expensesService.deleteExpenseFor(req.userId!, Number(req.params.expenseId));

  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

export const updateExpense = catchAsyncError(async (req, res, _) => {
  let { pay_at } = req.body;
  const { amount, category } = req.body;
  if (pay_at) {
    pay_at = new Date(pay_at);
  }
  const updatedExpense = await expensesService.updateExpenseFor(req.userId!, Number(req.params.expenseId), { amount, pay_at, category });

  res.status(200).json({
    status: "success",
    data: {
      updatedExpense,
    },
  });
});

export const getExpensesByStartAndEndDate = catchAsyncError(async (req, res, _) => {
  const startDate = new Date(req.params.startDate);
  const endDate = new Date(req.params.endDate);
  const expenses = await expensesService.getExpensesByStartDateAndEndDateFor(req.userId!, startDate, endDate);

  res.status(200).json({
    status: "success",
    data: {
      expenses,
    },
  });
});

export const getExpensesByPastDate = catchAsyncError(async (req, res, _) => {
  const pastDate = getPastDateFromFilteredQuery(createFilteredQuery(req.params.pastDate));
  const expenses = await expensesService.getExpensesByPastDateFor(req.userId!, pastDate);

  res.status(200).json({
    status: "success",
    data: {
      expenses,
    },
  });
});
