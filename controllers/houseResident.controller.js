import HouseResident from "../models/HouseResident.js";
import House from "../models/House.js";
import Resident from "../models/Resident.js";

export const create = async (req, res, next) => {
  const newHouseResident = new HouseResident({
    house_id: req.body.house_id,
    resident_id: req.body.resident_id,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });

  try {
    // Step 1: Check if house_id exists and get current status
    const houseExists = await new Promise((resolve, reject) => {
      House.findById(newHouseResident.house_id, (err, data) => {
        if (err || !data) {
          reject(new Error("House_Not_Found"));
        } else {
          resolve(data);
        }
      });
    });

    // Step 2: Check if resident_id exists
    const residentExists = await Resident.findById(
      newHouseResident.resident_id
    );

    // Step 3: If house is occupied, update it to unoccupied and remove resident_id
    if (houseExists.status === "occupied" && houseExists.resident_id) {
      await new Promise((resolve, reject) => {
        House.update(
          newHouseResident.house_id,
          { status: "unoccupied", resident_id: null },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
    }

    // Step 4: Create the HouseResident record
    HouseResident.create(newHouseResident, (err, data) => {
      if (err) {
        console.log(err);
        next(new Error("internal_error"));
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const houseResidents = await new Promise((resolve, reject) => {
      HouseResident.getAll((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const results = await Promise.all(
      houseResidents.map(async (item) => {
        const houseData = await new Promise((resolve, reject) => {
          House.findById(item.house_id, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });

        const resident = await Resident.findById(item.resident_id);
        const residentData = {
          fullname: resident.fullname,
          phone: resident.phone,
          status: resident.status,
          marital_status: resident.marital_status,
        };

        return {
          ...item,
          houseData,
          residentData,
        };
      })
    );

    res.send(results);
  } catch (err) {
    console.log(err);
    next(new Error("internal_error"));
  }
};

export const update = async (req, res, next) => {
  const updatedData = {
    house_id: req.body.house_id,
    resident_id: req.body.resident_id,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    next(new Error("No_Data_Provided"));
    return;
  }

  try {
    if (updatedData.house_id) {
      await new Promise((resolve, reject) => {
        House.findById(updatedData.house_id, (err, houseData) => {
          if (err || !houseData) {
            reject(new Error("House_Not_Found"));
          } else {
            const houseUpdateData = {
              resident_id: updatedData.resident_id,
              status: "occupied",
            };
            House.update(updatedData.house_id, houseUpdateData, (err, data) => {
              if (err) {
                reject(new Error("internal_error"));
              } else {
                resolve(data);
              }
            });
          }
        });
      });
    }

    // Check if resident_id exists
    if (updatedData.resident_id) {
      await new Promise((resolve, reject) => {
        Resident.findById(updatedData.resident_id)
          .then((data) => {
            if (!data) {
              reject(new Error("Resident_Not_Found"));
            } else {
              resolve(data);
            }
          })
          .catch((err) => reject(err));
      });
    }

    HouseResident.update(req.params.id, updatedData, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          next(new Error("HouseResident_Not_Found"));
        } else {
          console.log(err);
          next(new Error("internal_error"));
        }
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const findByHouseId = (req, res, next) => {
  HouseResident.findByHouseId(req.params.houseId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found house with id ${req.params.houseId}.`,
        });
      } else {
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};
