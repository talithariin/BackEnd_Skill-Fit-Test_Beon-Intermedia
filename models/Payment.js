import sql from "./connection.js";

const Payment = function (payment) {
  this.resident_id = payment.resident_id;
  this.house_id = payment.house_id;
  this.fee_type_id = payment.fee_type_id;
  this.payment_date = payment.payment_date;
  this.period = payment.period;
  this.status = payment.status;
  this.amount = payment.amount;
};
const tableName = "Payments";

Payment.create = (newPayment, result) => {
  const {
    resident_id,
    house_id,
    fee_type_id,
    payment_date,
    period,
    status,
    amount,
  } = newPayment;
  console.log("Data to be entered:", newPayment);

  sql.query(
    `INSERT INTO ${tableName} (resident_id, house_id, fee_type_id, payment_date, period, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [resident_id, house_id, fee_type_id, payment_date, period, status, amount],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newPayment });
      }
    }
  );
};

Payment.getAll = (result) => {
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

export default Payment;
