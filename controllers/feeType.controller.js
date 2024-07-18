import FeeType from "../models/FeeType.js";

export const create = (req, res, next) => {
  const newHouse = new FeeType({
    name: req.body.name,
    amount: req.body.amount,
    frequency: req.body.frequency,
  });

  FeeType.create(newHouse, (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    }
    res.send(data);
  });
};

export const getAll = (req, res, next) => {
  FeeType.getAll((err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    } else {
      res.send(data);
    }
  });
};

export const update = (req, res, next) => {
  const updatedData = {
    name: req.body.name,
    amount: req.body.amount,
    frequency: req.body.frequency,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    next(new Error("No_Data_Provided"));
    return;
  }

  FeeType.update(req.params.id, updatedData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        next(new Error("FeeType_Not_Found"));
      } else {
        console.log(err);
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};
