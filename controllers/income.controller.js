import Income from "../models/Income.js";

export const create = (req, res, next) => {
  const newIncome = new Income({
    payment_id: req.body.payment_id,
    fee_type_id: req.body.fee_type_id,
    total: req.body.total,
  });

  // cek apakah income dengan fee_type_id sudah ada
  Income.findByFeeTypeId(req.body.fee_type_id, (err, data) => {
    if (err && err.type === "not_found") {
      // jika tidak ada, set total = req.body.total
      newIncome.total = req.body.total;
    } else if (err) {
      console.log(err);
      return next(new Error("internal_error"));
    } else {
      // jika ada, maka set total = data total sebelumnya + data total yg akan dimasukkan
      newIncome.total = data[0].total + req.body.total;
    }

    Income.create(newIncome, (createErr, createData) => {
      if (createErr) {
        console.log(createErr);
        return next(new Error("internal_error"));
      }
      res.send(createData);
    });
  });
};

export const findByFeeType = (req, res, next) => {
  Income.findByFeeTypeId(req.params.feeTypeId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found fee type with id: ${req.params.feeTypeId}`,
        });
      } else {
        next(new Error("internal_error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const findMonthlyIncome = (req, res, next) => {
  const { month, year } = req.params;

  Income.findMonthlyIncome(month, year, (err, data) => {
    if (err) {
      console.log(err);
      return next(new Error("internal_error"));
    }
    res.send(data);
  });
};
