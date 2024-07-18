import Resident from "../models/Resident.js";

export const create = (req, res, next) => {
  const newResident = new Resident({
    fullname: req.body.fullname,
    ktp: req.file ? req.file.buffer : null,
    phone: req.body.phone,
    status: req.body.status,
    marital_status: req.body.marital_status,
  });

  Resident.create(newResident, (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
};

export const getAll = (res, next) => {
  Resident.getAll((err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
};

export const findOne = (req, res, next) => {
  Resident.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found resident with id : ${req.params.id}`,
        });
        next(new Error("Resident_Not_Found"));
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
    fullname: req.body.fullname,
    ktp: req.file ? req.file.buffer : undefined,
    phone: req.body.phone,
    status: req.body.status,
    marital_status: req.body.marital_status,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    next(new Error("No_Data_Provided"));
    return;
  }

  Resident.update(req.params.id, updatedData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        next(new Error("Resident_Not_Found"));
      } else {
        console.log(err);
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};
