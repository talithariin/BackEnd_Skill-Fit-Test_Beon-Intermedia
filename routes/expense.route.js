import { Router } from "express";
import {
  create,
  findMonthlyExpense,
  getAll,
} from "../controllers/expense.controller.js";
import { validateExpenseSchema } from "../middlewares/validators.js";

const expenseRoute = Router();

expenseRoute.post("/", validateExpenseSchema, create);
expenseRoute.get("/", getAll);
expenseRoute.get("/monthly/:month/:year", findMonthlyExpense);

export default expenseRoute;
