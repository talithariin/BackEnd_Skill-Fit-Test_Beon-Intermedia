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

  const values = [payment_id, fee_type_id, total];
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
          total: parseFloat(total),
        });
      }
    }
  );
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

Income.findLatestTotal = (callback) => {
  sql.query(
    `SELECT COALESCE(SUM(total), 0) as latest_total FROM ${tableName} ORDER BY id DESC LIMIT 1`,
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        callback(err, null);
        return;
      }

      callback(null, res.length ? res[0].latest_total : 0);
    }
  );
};

Income.findMonthlyIncome = (month, year, result) => {
  sql.query(
    `SELECT COALESCE(SUM(i.total), 0) as monthly_income 
     FROM ${tableName} i
     JOIN Payments p ON i.payment_id = p.id
     WHERE MONTH(p.payment_date) = ? AND YEAR(p.payment_date) = ?`,
    [month, year],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
        return;
      }
      result(null, res.length ? res[0].monthly_income : 0);
    }
  );
};

Income.getAll = (result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
    } else {
      console.log("Data retrieved successfully:", res);
      result(null, res);
    }
  });
};

export default Income;
