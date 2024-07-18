import sql from "./connection.js";

const Payment = function (payment) {
  this.resident_id = payment.resident_id;
  this.fee_type_id = payment.fee_type_id;
  this.payment_date = payment.payment_date;
  this.period = payment.period;
  this.status = payment.status;
};

Payment.create = (newPayment, result) => {
  const { resident_id, fee_type_id, payment_date, period, status } = newPayment;
  console.log("Data to be entered:", newPayment);

  sql.query(
    `INSERT INTO ${tableName} (resident_id, fee_type_id, payment_date, period, status) VALUES (?, ?, ?)`,
    [resident_id, fee_type_id, payment_date, period, status],
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

const tableName = "Payments";

export default Payment;
