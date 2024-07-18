import sql from "./connection.js";

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
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newFeeType });
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

export default FeeType;
