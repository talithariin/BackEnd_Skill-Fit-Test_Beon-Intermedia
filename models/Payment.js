import sql from "./connection.js";

const Payment = function (payment) {
  this.resident_id = payment.resident_id;
  this.fee_type_id = payment.fee_type_id;
  this.payment_date = payment.payment_date;
  this.period = payment.period;
  this.status = payment.status;
};

const tableName = "Payments";
