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
    .integer("resident id must be a number")
    .required("resident id is required"),
  house_id: yup
    .number()
    .integer("house id must be a number")
    .required("house id is required"),
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

export const feeTypeSchema = yup.object().shape({
  name: yup.string().required("Name of Fee Type is required"),
  amount: yup
    .number()
    .integer("Amount must be a number")
    .required("Amount is required"),
  frequency: yup
    .string()
    .oneOf(
      ["once", "monthly", "yearly"],
      "Frequency must be one of: once, monthly, yearly"
    )
    .required("Frequency is required"),
});

export const validateFeeTypeSchema = async (req, res, next) => {
  try {
    await feeTypeSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const paymentSchema = yup.object().shape({
  resident_id: yup
    .number()
    .integer("resident id must be a number")
    .required("resident id is required"),
  house_id: yup
    .number()
    .integer("house id must be a number")
    .required("house id is required"),
  fee_type_id: yup
    .number()
    .integer("fee type id must be a number")
    .required("fee type id is required"),
  payment_date: yup
    .date()
    .typeError("payment date must be a valid date")
    .required("payment date is required"),
  period: yup
    .string()
    .oneOf(
      ["once", "monthly", "yearly"],
      "period must be one of: once, monthly, yearly"
    )
    .required("period is required"),
  amount: yup
    .number()
    .integer("amount must be a number")
    .required("amount is required"),
});

export const validatePaymentSchema = async (req, res, next) => {
  try {
    await paymentSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const incomeSchema = yup.object().shape({
  payment_id: yup
    .number()
    .integer("payment id must be a number")
    .required("payment id is required"),
  fee_type_id: yup
    .number()
    .integer("fee type id must be a number")
    .required("fee type id is required"),
  total: yup
    .number()
    .integer("total must be a number")
    .required("total is required"),
});

export const validateIncomeSchema = async (req, res, next) => {
  try {
    await incomeSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const expenseSchema = yup.object().shape({
  description: yup.string().required("Description is required"),
  expense_date: yup.date().required("Expense date is required"),
  amount: yup
    .number()
    .integer("Amount must be a number")
    .required("Amount is required"),
});

export const validateExpenseSchema = async (req, res, next) => {
  try {
    await expenseSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
