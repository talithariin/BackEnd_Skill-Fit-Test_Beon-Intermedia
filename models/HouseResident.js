import sql from "./connection.js";
import House from "./House.js";
import Resident from "./Resident.js";

const HouseResident = function (houseResident) {
  this.house_id = houseResident.house_id;
  this.resident_id = houseResident.resident_id;
  this.startdate = houseResident.startdate;
  this.enddate = houseResident.enddate;
};

const tableName = "HouseResident";

HouseResident.create = (newHouseResident, result) => {
  const { house_id, resident_id, startdate, enddate } = newHouseResident;
  console.log("Data to be entered:", newHouseResident);

  sql.query(
    `INSERT INTO ${tableName} (house_id, resident_id, startdate, enddate) VALUES (?, ?, ?, ?)`,
    [house_id, resident_id, startdate, enddate],
    (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
      } else {
        console.log("Data is successfully entered:", res);
        result(null, { id: res.insertId, ...newHouseResident });
      }
    }
  );
};

HouseResident.update = (id, updatedData, result) => {
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

HouseResident.findByHouseId = (houseId, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE house_id = ?`,
    houseId,
    async (err, res) => {
      if (err) {
        console.log("Error while querying:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        try {
          // Mengambil data house dan resident
          const detailedResults = await Promise.all(
            res.map(async (houseResident) => {
              const houseData = await new Promise((resolve, reject) => {
                House.findById(houseResident.house_id, (errHouse, data) => {
                  if (errHouse) reject(errHouse);
                  resolve(data);
                });
              });

              const residentData = await new Promise((resolve, reject) => {
                Resident.findById(
                  houseResident.resident_id,
                  (errResident, data) => {
                    if (errResident) reject(errResident);
                    resolve(data);
                  }
                );
              });

              return {
                id: houseResident.id,
                house_id: houseResident.house_id,
                house: houseData,
                resident_id: houseResident.resident_id,
                resident: residentData,
                startdate: houseResident.startdate,
                enddate: houseResident.enddate,
              };
            })
          );

          result(null, detailedResults);
        } catch (error) {
          console.log("Error while fetching house or resident data:", error);
          result(error, null);
        }
        return;
      }
      result(
        { type: "not_found", message: `Not found house with id ${houseId}` },
        null
      );
    }
  );
};

export default HouseResident;
