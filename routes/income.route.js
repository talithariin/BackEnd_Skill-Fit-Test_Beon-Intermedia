import { Router } from "express";
import {
  create,
  findByFeeType,
  findMonthlyIncome,
  getAll,
} from "../controllers/income.controller.js";
import { validateIncomeSchema } from "../middlewares/validators.js";

const incomeRoute = Router();

incomeRoute.get("/:feeTypeId", findByFeeType);
incomeRoute.post("/", validateIncomeSchema, create);
incomeRoute.get("/monthly/:month/:year", findMonthlyIncome);
incomeRoute.get("/", getAll);

export default incomeRoute;
