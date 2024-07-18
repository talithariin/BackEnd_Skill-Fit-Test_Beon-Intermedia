import Payment from "../models/Payment.js";
import Resident from "../models/Resident.js";
import FeeType from "../models/FeeType.js";
import House from "../models/House.js";
import Income from "../models/Income.js";

export const create = async (req, res, next) => {
  const newPayment = new Payment({
    resident_id: req.body.resident_id,
    house_id: req.body.house_id,
    fee_type_id: req.body.fee_type_id,
    payment_date: req.body.payment_date,
    period: req.body.period,
    status: req.body.status || "paid",
    amount: req.body.amount || "0",
  });

  try {
    // Check if fee_type_id exists
    await new Promise((resolve, reject) => {
      FeeType.findById(newPayment.fee_type_id, (err, data) => {
        if (err || !data) {
          reject(new Error("FeeType_Not_Found"));
        } else {
          resolve(data);
        }
      });
    });

    // Check if resident_id exists
    await new Promise((resolve, reject) => {
      Resident.findById(newPayment.resident_id, (err, data) => {
        if (err || !data) {
          reject(new Error("Resident_Not_Found"));
        } else {
          resolve(data);
        }
      });
    });

    // Check if house_id exists
    await new Promise((resolve, reject) => {
      House.findById(newPayment.house_id, (err, data) => {
        if (err || !data) {
          reject(new Error("House_Not_Found"));
        } else {
          resolve(data);
        }
      });
    });

    // Create new payment record
    Payment.create(newPayment, async (err, paymentData) => {
      if (err) {
        console.log(err);
        next(new Error("internal_error"));
      } else {
        let totalIncome = parseFloat(newPayment.amount);

        try {
          // Fetch the latest total income
          const latestIncome = await new Promise((resolve, reject) => {
            Income.findLatestTotal((incomeErr, data) => {
              if (incomeErr && incomeErr.type === "not_found") {
                resolve(0); // No existing income found, return 0
              } else if (incomeErr) {
                reject(incomeErr);
              } else {
                resolve(data); // Latest income found
              }
            });
          });

          if (latestIncome !== null && latestIncome !== undefined) {
            totalIncome += parseFloat(latestIncome.total || 0); // Access total safely
          }

          console.log(`latest income ${latestIncome}`);

          const newIncome = new Income({
            payment_id: paymentData.id,
            fee_type_id: newPayment.fee_type_id,
            total: totalIncome,
          });

          // Create new income record
          Income.create(newIncome, (createErr, createData) => {
            if (createErr) {
              console.log(createErr);
              return next(new Error("internal_error"));
            }
            res.send({ payment: paymentData, income: createData });
          });
        } catch (error) {
          console.log(error);
          return next(new Error("internal_error"));
        }
      }
    });
  } catch (error) {
    if (error.message === "FeeType_Not_Found") {
      res.status(404).send({
        message: `Not found fee type with id ${newPayment.fee_type_id}`,
      });
    } else if (error.message === "Resident_Not_Found") {
      res.status(404).send({
        message: `Not found resident with id ${newPayment.resident_id}`,
      });
    } else if (error.message === "House_Not_Found") {
      res.status(404).send({
        message: `Not found house with id ${newPayment.house_id}`,
      });
    } else {
      next(error);
    }
  }
};

export const getAll = (req, res, next) => {
  Payment.getAll((err, data) => {
    if (err) {
      console.log(err);
      next(new Error("internal_error"));
    } else {
      res.send(data);
    }
  });
};
