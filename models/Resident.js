import sql from "./connection.js";

const Resident = function (resident) {
  this.fullname = resident.fullname;
  this.ktp = resident.ktp;
  this.phone = resident.phone;
  this.status = resident.status;
  this.marital_status = resident.marital_status;
};

const tableName = "Residents";

Resident.create = (newResident, result) => {
  const { fullname, ktp, phone, status, marital_status } = newResident;
  console.log("Data to be entered:", newResident);

  sql.query(
    `INSERT INTO ${tableName} (fullname, ktp, phone, status, marital_status) VALUES (?, ?, ?, ?, ?)`,
    [fullname, ktp, phone, status, marital_status],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newResident });
      }
    }
  );
};

Resident.getAll = (result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
    } else {
      console.log("Data retrieved successfully:", res);
      const dataWithBase64KTP = res.map((row) => {
        return {
          ...row,
          ktp: row.ktp ? Buffer.from(row.ktp).toString("base64") : null,
        };
      });
      result(null, dataWithBase64KTP);
    }
  });
};

Resident.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
      return;
    }
    if (res.length) {
      const dataWithBase64KTP = {
        ...res[0],
        ktp: res[0].ktp ? Buffer.from(res[0].ktp).toString("base64") : null,
      };
      result(null, dataWithBase64KTP);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

Resident.update = (id, updatedData, result) => {
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

      console.log("Resident updated successfully");
      result(null, { id: id, ...updatedData });
    }
  );
};

export default Resident;
