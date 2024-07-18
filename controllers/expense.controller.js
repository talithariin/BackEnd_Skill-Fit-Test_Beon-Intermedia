import Expense from "../models/Expense.js";

export const create = (req, res, next) => {
  const newExpense = new House({
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
