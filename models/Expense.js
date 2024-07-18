import sql from "./connection.js";

const Expense = function (expense) {
  this.description = expense.description;
  this.expense_date = expense.expense_date;
  this.amount = expense.amount;
};

const tableName = "Expenses";

Expense.create = (newExpense, result) => {
  const { description, expense_date, amount } = newExpense;
  console.log("Data to be entered:", newExpense);

  sql.query(
    `INSERT INTO ${tableName} (description, expense_date, amount) VALUES (?, ?, ?)`,
    [description, expense_date, amount],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newExpense });
      }
    }
  );
};

export default Expense;
