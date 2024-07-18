import HouseResident from "../models/HouseResident.js";
import House from "../models/House.js";
import Resident from "../models/Resident.js";

export const create = (req, res, next) => {
  const newHouseResident = new HouseResident({
    house_id: req.body.house_id,
    resident_id: req.body.resident_id,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });

  HouseResident.create(newHouseResident, (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
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
    // Check if house_id exists
    if (updatedData.house_id) {
      const houseExists = await new Promise((resolve, reject) => {
        House.findById(updatedData.house_id, (err, data) => {
          if (err) {
            reject(new Error("House_Not_Found"));
          } else {
            resolve(data);
          }
        });
      });
    }

    // Check if resident_id exists
    if (updatedData.resident_id) {
      const residentExists = await new Promise((resolve, reject) => {
        Resident.findById(updatedData.resident_id, (err, data) => {
          if (err) {
            reject(new Error("Resident_Not_Found"));
          } else {
            resolve(data);
          }
        });
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
