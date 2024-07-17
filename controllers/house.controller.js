import House from "../models/House.js";

export const create = (req, res) => {
  const newHouse = new House({
    fullname: req.body.resident_id,
    status: req.body.status,
    address: req.body.address,
  });

  House.create(newHouse, (err, data) => {
    if (err) {
      console.log(err);
      throw { type: "internal_error" };
    }
    res.send(data);
  });
};

export const getAll = (req, res) => {
  House.getAll((err, data) => {
    if (err) {
      console.log(err);
      throw { type: "internal_error" };
    }
    res.send(data);
  });
};

export const findOne = (req, res) => {
  House.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found house with id : ${req.params.id}`,
        });
        throw { type: "House_Not_Found" };
      } else {
        throw { type: "internal_error" };
      }
    } else {
      res.send(data);
    }
  });
};

export const update = (req, res) => {
  const updatedData = {
    resident_id: req.body.resident_id,
    status: req.body.status,
    address: req.body.address,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] === undefined && delete updatedData[key]
  );

  House.update(req.params.id, updatedData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        throw { type: "House_Not_Found" };
      } else {
        console.log(err);
        throw { type: "internal_error" };
      }
    } else {
      res.send(data);
    }
  });
};
