import sql from "./connection.js";
import Payment from "./Payment.js";

const FeeType = function (feeType) {
  this.name = feeType.name;
  this.amount = feeType.amount;
  this.frequency = feeType.frequency;
};

const tableName = "FeeType";

FeeType.create = (newFeeType, result) => {
  const { name, amount, frequency } = newFeeType;
  console.log("Data to be entered:", newFeeType);

  sql.query(
    `INSERT INTO ${tableName} (name, amount, frequency) VALUES (?, ?, ?)`,
    [name, amount, frequency],
    async (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newFeeType });

        try {
          // Ambil semua rumah dengan status occupied
          const houses = await new Promise((resolve, reject) => {
            sql.query(
              "SELECT * FROM Houses WHERE status = 'occupied'",
              (err, houses) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(houses);
                }
              }
            );
          });

          // Buat atau perbarui payment untuk setiap rumah yang occupied
          const paymentPromises = houses.map((house) => {
            const newPayment = new Payment({
              resident_id: house.resident_id,
              fee_type_id: res.insertId,
              house_id: house.id,
              payment_date: null,
              period: null,
              status: "unpaid",
              amount: "0",
              description: null,
            });

            return new Promise((resolve, reject) => {
              Payment.createOrUpdate(newPayment, (err, payment) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(payment);
                }
              });
            });
          });
          await Promise.all(paymentPromises);
        } catch (error) {
          console.log("Error while creating or updating payments:", error);
        }
      }
    }
  );
};

FeeType.getAll = (result) => {
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

FeeType.update = (id, updatedData, result) => {
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

      console.log("Fee Type updated successfully");
      result(null, { id: id, ...updatedData });
    }
  );
};

FeeType.findById = (id, callback) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      callback(err, null);
    } else {
      if (res.length) {
        callback(null, res[0]);
      } else {
        callback({ type: "not_found" }, null);
      }
    }
  });
};

export default FeeType;
