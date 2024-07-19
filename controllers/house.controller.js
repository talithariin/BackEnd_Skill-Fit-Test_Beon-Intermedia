import House from "../models/House.js";

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

export const getAll = (req, res, next) => {
  House.getAll((err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    } else {
      res.send(data);
    }
  });
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
