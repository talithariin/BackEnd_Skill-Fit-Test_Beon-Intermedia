import { Router } from "express";
import { create, getAll } from "../controllers/payment.controller.js";
import { validatePaymentSchema } from "../middlewares/validators.js";

const paymentRoute = Router();

paymentRoute.get("/", getAll);
paymentRoute.post("/", validatePaymentSchema, create);

export default paymentRoute;
