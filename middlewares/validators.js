import * as yup from "yup";

export const residentSchema = yup.object().shape({
  fullname: yup.string().required("fullname is required"),
  phone: yup.string().required("phone is required"),
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
