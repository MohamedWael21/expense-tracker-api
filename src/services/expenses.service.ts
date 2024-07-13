import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import AppError from "../lib/app-error";

type expensePayload = Omit<Prisma.ExpenseCreateInput, "User">;
type updateExpensePayload = Partial<expensePayload>;

export async function getExpensesFor(userId: number) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
    },
  });
  return expenses;
}

export async function addExpenseFor(userId: number, expense: expensePayload) {
  const newExpense = await prisma.expense.create({
    data: {
      ...expense,
      User: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newExpense;
}

export async function getExpenseFor(userId: number, expenseId: number) {
  const expense = await prisma.expense.findFirst({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          id: expenseId,
        },
      ],
    },
  });
  if (!expense) throw new AppError("This expense not found", 404);
  return expense;
}

export async function deleteExpenseFor(userId: number, expenseId: number) {
  const expense = await prisma.expense.findFirst({
    where: {
      AND: [{ userId: userId }, { id: expenseId }],
    },
  });

  if (!expense) {
    throw new AppError("This expense not found", 404);
  }

  const deletedExpense = await prisma.expense.delete({
    where: {
      id: expense.id,
    },
  });

  return deletedExpense;
}

export async function updateExpenseFor(userId: number, expenseId: number, updateData: updateExpensePayload) {
  const expense = await prisma.expense.findFirst({
    where: {
      AND: [{ userId: userId }, { id: expenseId }],
    },
  });

  if (!expense) {
    throw new AppError("This expense not found", 404);
  }
  console.log(updateData);
  const updatedExpense = await prisma.expense.update({
    where: {
      id: expense.id,
    },
    data: {
      ...updateData,
    },
  });

  return updatedExpense;
}

export async function getExpensesByStartDateAndEndDateFor(userId: number, startDate: Date, endDate: Date) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
      pay_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return expenses;
}

export async function getExpensesByPastDateFor(userId: number, pastDate: Date) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
      pay_at: {
        gte: pastDate,
      },
    },
  });

  return expenses;
}
