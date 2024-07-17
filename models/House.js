import sql from "./connection.js";

const House = function (house) {
  this.resident_id = house.resident_id;
  this.status = house.status;
  this.address = house.address;
};

const tableName = "Houses";

House.create = (newHouse, result) => {
  const { resident_id, status, address } = newHouse;
  console.log("Data to be entered:", newHouse);

  const values = [
    newHouse.resident_id,
    newHouse.status ? newHouse.status : "unoccupied",
    newHouse.address,
  ];

  sql.query(
    `INSERT INTO ${tableName} (resident_id, status, address) VALUES (?, ?, ?)`,
    values,
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newHouse });
      }
    }
  );
};

House.getAll = (result) => {
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

House.findById = (id, result) => {
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

House.update = (id, updatedData, result) => {
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

      console.log("House updated successfully");
      result(null, { id: id, ...updatedData });
    }
  );
};

export default House;
