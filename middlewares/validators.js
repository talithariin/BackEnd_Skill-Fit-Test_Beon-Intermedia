import * as yup from "yup";

export const residentSchema = yup.object().shape({
  fullname: yup.string().required("fullname is required"),
  phone: yup
    .string()
    .min(11, "phone must be at least 11 characters")
    .max(15, "phone must be at most 15 characters")
    .required("phone is required"),
});

export const validateResidentSchema = async (req, res, next) => {
  try {
    await residentSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const houseSchema = yup.object().shape({
  address: yup.string().required("address is required"),
});

export const validateHouseSchema = async (req, res, next) => {
  try {
    await houseSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const houseResidentSchema = yup.object().shape({
  resident_id: yup
    .number()
    .integer("resident_id must be a number")
    .required("resident_id is required"),
  house_id: yup
    .number()
    .integer("house_id must be a number")
    .required("house_id is required"),
  startdate: yup.date().required("startdate is required"),
});

export const validateHouseResidentSchema = async (req, res, next) => {
  try {
    await houseResidentSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
