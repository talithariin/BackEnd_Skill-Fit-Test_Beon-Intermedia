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
    description: req.body.description || null,
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
    await Resident.findById(newPayment.resident_id);

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

    // Create or update payment record
    Payment.createOrUpdate(newPayment, (err, paymentData) => {
      if (err) {
        console.log(err);
        next(new Error("internal_error"));
      } else {
        const paymentAmount = parseFloat(newPayment.amount);

        const newIncome = new Income({
          payment_id: paymentData.id,
          fee_type_id: newPayment.fee_type_id,
          total: paymentAmount,
        });

        // Create new income record
        Income.create(newIncome, (createErr, createData) => {
          if (createErr) {
            console.log(createErr);
            return next(new Error("internal_error"));
          }
          res.send({ payment: paymentData, income: createData });
        });
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

export const getAll = async (req, res, next) => {
  try {
    const payments = await new Promise((resolve, reject) => {
      Payment.getAll((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const residentData = await Resident.findById(payment.resident_id);
        const houseData = await new Promise((resolve, reject) => {
          House.findById(payment.house_id, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
        const feeTypeData = await new Promise((resolve, reject) => {
          FeeType.findById(payment.fee_type_id, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });

        return {
          ...payment,
          resident_data: residentData,
          house_data: houseData,
          fee_type_data: feeTypeData,
        };
      })
    );

    res.send(paymentsWithDetails);
  } catch (error) {
    console.log("Error:", error);
    next(new Error("internal_error"));
  }
};
