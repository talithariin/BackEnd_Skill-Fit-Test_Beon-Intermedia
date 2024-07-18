import { Router } from "express";
import { create } from "../controllers/expense.controller.js";
import { validateExpenseSchema } from "../middlewares/validators.js";

const expenseRoute = Router();

expenseRoute.post("/", validateExpenseSchema, create);

export default expenseRoute;
