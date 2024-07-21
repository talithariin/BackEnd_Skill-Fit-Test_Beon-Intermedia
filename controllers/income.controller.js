import Income from "../models/Income.js";
import Payment from "../models/Payment.js";
import FeeType from "../models/FeeType.js";
import Resident from "../models/Resident.js";

export const create = (req, res, next) => {
  const newIncome = new Income({
    payment_id: req.body.payment_id,
    fee_type_id: req.body.fee_type_id,
    total: req.body.total,
  });

  Income.create(newIncome, (createErr, createData) => {
    if (createErr) {
      console.log(createErr);
      return next(new Error("internal_error"));
    }
    res.send(createData);
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
    res.send({ monthly_income: data });
  });
};

export const getAll = (req, res, next) => {
  Income.getAll(async (err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    } else {
      try {
        const dataWithDetails = await Promise.all(
          data.map(async (income) => {
            const paymentData = await new Promise((resolve, reject) => {
              Payment.findById(income.payment_id, (err, payment) => {
                if (err) reject(err);
                else resolve(payment);
              });
            });

            const feeTypeData = await new Promise((resolve, reject) => {
              FeeType.findById(income.fee_type_id, (err, feeType) => {
                if (err) reject(err);
                else resolve(feeType);
              });
            });

            const residentData = await new Promise((resolve, reject) => {
              Resident.findById(paymentData.resident_id)
                .then((data) => resolve(data))
                .catch((errResident) => reject(errResident));
            });

            return {
              ...income,
              paymentData,
              feeTypeData,
              resident_fullname: residentData.fullname,
            };
          })
        );

        res.send(dataWithDetails);
      } catch (error) {
        console.log("Error while fetching related data:", error);
        next(new Error("internal_error"));
      }
    }
  });
};
