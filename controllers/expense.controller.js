import Expense from "../models/Expense.js";

export const create = (req, res, next) => {
  const newExpense = new Expense({
    description: req.body.description,
    expense_date: req.body.expense_date,
    amount: req.body.amount,
  });

  Expense.create(newExpense, (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
};

export const getAll = (req, res, next) => {
  Expense.getAll((err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    } else {
      res.send(data);
    }
  });
};

export const findMonthlyExpense = (req, res, next) => {
  const { month, year } = req.params;

  Expense.findMonthlyExpense(month, year, (err, data) => {
    if (err) {
      console.log(err);
      return next(new Error("internal_error"));
    }
    res.send({ monthly_expense: data });
  });
};
