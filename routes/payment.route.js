import { Router } from "express";
import { create, getAll, update } from "../controllers/payment.controller.js";
import { validatePaymentSchema } from "../middlewares/validators.js";

const paymentRoute = Router();

paymentRoute.get("/", getAll);
paymentRoute.post("/", validatePaymentSchema, create);
paymentRoute.put("/:id", update);

export default paymentRoute;
