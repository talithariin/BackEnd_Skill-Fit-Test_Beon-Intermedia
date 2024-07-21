import sql from "./connection.js";

const Payment = function (payment) {
  this.resident_id = payment.resident_id;
  this.house_id = payment.house_id;
  this.fee_type_id = payment.fee_type_id;
  this.payment_date = payment.payment_date;
  this.period = payment.period;
  this.status = payment.status;
  this.amount = payment.amount;
  this.description = payment.description;
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
    description,
  } = newPayment;
  console.log("Data to be entered:", newPayment);

  sql.query(
    `INSERT INTO ${tableName} (resident_id, house_id, fee_type_id, payment_date, period, status, amount, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      resident_id,
      house_id,
      fee_type_id,
      payment_date,
      period,
      status,
      amount,
      description,
    ],
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

Payment.createOrUpdate = (newPayment, result) => {
  const {
    resident_id,
    house_id,
    fee_type_id,
    payment_date,
    period,
    status,
    amount,
    description,
  } = newPayment;
  console.log("Data to be entered or updated:", newPayment);

  // Check if payment data already exists
  sql.query(
    `SELECT * FROM ${tableName} WHERE resident_id = ? AND fee_type_id = ?`,
    [resident_id, fee_type_id],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
        return;
      }

      if (res.length > 0) {
        // Payment data exists, update it
        const paymentId = res[0].id;
        sql.query(
          `UPDATE ${tableName} SET house_id = ?, payment_date = ?, period = ?, status = ?, amount = ?, description = ? WHERE id = ?`,
          [
            house_id,
            payment_date,
            period,
            status,
            amount,
            description,
            paymentId,
          ],
          (updateErr, updateRes) => {
            if (updateErr) {
              console.log("Error while updating:", updateErr);
              result(updateErr, null);
            } else {
              console.log("Data updated successfully:", updateRes);
              result(null, { id: paymentId, ...newPayment });
            }
          }
        );
      } else {
        // Payment data doesn't exist, insert it
        sql.query(
          `INSERT INTO ${tableName} (resident_id, house_id, fee_type_id, payment_date, period, status, amount, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            resident_id,
            house_id,
            fee_type_id,
            payment_date,
            period,
            status,
            amount,
            description,
          ],
          (insertErr, insertRes) => {
            if (insertErr) {
              console.log("Error while inserting:", insertErr);
              result(insertErr, null);
            } else {
              console.log("Data inserted successfully:", insertRes);
              result(null, { id: insertRes.insertId, ...newPayment });
            }
          }
        );
      }
    }
  );
};

Payment.update = (id, updatedData, result) => {
  sql.query(
    `UPDATE ${tableName} SET ? WHERE id = ?`,
    [updatedData, id],
    (err, res) => {
      if (err) {
        console.log("Error while updating:", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ type: "not_found" }, null);
        return;
      }

      console.log("Payment updated successfully");
      result(null, { id: id, ...updatedData });
    }
  );
};

Payment.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

export default Payment;
