import { Router } from "express";
import {
  create,
  findByHouseId,
  update,
} from "../controllers/houseResident.controller.js";
import { validateHouseResidentSchema } from "../middlewares/validators.js";

const houseResidentRoute = Router();

houseResidentRoute.post("/", validateHouseResidentSchema, create);
houseResidentRoute.get("/:houseId", findByHouseId);
houseResidentRoute.put("/:id", update);

export default houseResidentRoute;
