import House from "../models/House.js";
import Resident from "../models/Resident.js";

export const create = (req, res, next) => {
  const newHouse = new House({
    resident_id: req.body.resident_id,
    status: req.body.status,
    address: req.body.address,
  });

  House.create(newHouse, (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
};

export const getAll = async (req, res, next) => {
  try {
    const data = await new Promise((resolve, reject) => {
      House.getAll((err, data) => {
        if (err) {
          console.log(err);
          reject(new Error("internal_error"));
        } else {
          resolve(data);
        }
      });
    });

    // Ambil data resident dan gabungkan dengan data house
    const result = await Promise.all(
      data.map(async (house) => {
        if (house.status === "occupied" && house.resident_id) {
          try {
            const resident = await Resident.findById(house.resident_id);
            // Hanya ambil field yang diperlukan dari residentData
            const filteredResidentData = {
              fullname: resident.fullname,
              phone: resident.phone,
              status: resident.status,
            };
            return { ...house, residentData: filteredResidentData };
          } catch (err) {
            // Jika tidak ditemukan atau terjadi error pada resident
            console.error("Error finding resident:", err);
            return { ...house, residentData: null };
          }
        } else {
          // Jika status 'unoccupied' atau resident_id null, set residentData ke null
          return { ...house, residentData: null };
        }
      })
    );

    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const findOne = (req, res, next) => {
  House.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found house with id : ${req.params.id}`,
        });
        next(new Error("House_Not_Found"));
      } else {
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const update = (req, res, next) => {
  const updatedData = {
    resident_id: req.body.resident_id,
    status: req.body.status,
    address: req.body.address,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    next(new Error("No_Data_Provided"));
    return;
  }

  if (updatedData.status === "unoccupied") {
    updatedData.resident_id = null;
  }

  House.update(req.params.id, updatedData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        next(new Error("House_Not_Found"));
      } else {
        console.log(err);
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};
