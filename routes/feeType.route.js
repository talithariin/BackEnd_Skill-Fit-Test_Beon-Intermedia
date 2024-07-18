import { Router } from "express";
import { getAll, create, update } from "../controllers/feeType.controller.js";
import { validateFeeTypeSchema } from "../middlewares/validators.js";

const feeTypeRoute = Router();

feeTypeRoute.get("/", getAll);
feeTypeRoute.post("/", validateFeeTypeSchema, create);
feeTypeRoute.put("/:id", update);

export default feeTypeRoute;
