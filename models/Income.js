import sql from "./connection.js";

const Income = function (income) {
  this.payment_id = income.payment_id;
  this.fee_type_id = income.fee_type_id;
  this.total = income.total;
};

const tableName = "Income";

Income.create = (newIncome, result) => {
  const { payment_id, fee_type_id, total } = newIncome;
  console.log("Data to be entered:", newIncome);

  // First, check if an income with the given fee_type_id exists
  Income.findByFeeTypeId(fee_type_id, (err, data) => {
    let updatedTotal = total;
    if (err && err.type === "not_found") {
      // If no previous income, total is as is
      updatedTotal = total;
    } else if (err) {
      console.log("Error while querying:", err);
      result(err, null);
      return;
    } else {
      // If found, add the existing total to the new total
      updatedTotal = data[0].total + total;
    }

    const values = [payment_id, fee_type_id, updatedTotal];
    sql.query(
      `INSERT INTO ${tableName} (payment_id, fee_type_id, total) VALUES (?, ?, ?)`,
      values,
      (createErr, res) => {
        if (createErr) {
          console.log("Error while querying:", createErr);
          result(createErr, null);
        } else {
          console.log("Data is successfully entered:", res);
          result(null, {
            id: res.insertId,
            payment_id,
            fee_type_id,
            total: updatedTotal,
          });
        }
      }
    );
  });
};

Income.findByFeeTypeId = (id, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE fee_type_id = ?`,
    id,
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      result({ type: "not_found" }, null);
    }
  );
};

Income.findMonthlyIncome = (month, year, result) => {
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  sql.query(
    `SELECT p.fee_type_id, SUM(p.amount) as total, f.name as fee_type_name
     FROM Payments p
     JOIN FeeType f ON p.fee_type_id = f.id
     WHERE p.payment_date BETWEEN ? AND ? AND p.status = 'paid'
     GROUP BY p.fee_type_id, f.name`,
    [startDate, endDate],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

export default Income;
