import { Router } from "express";
import {
  create,
  findByHouseId,
  update,
} from "../controllers/houseResident.controller.js";

const houseResidentRoute = Router();

houseResidentRoute.post("/", create);
houseResidentRoute.get("/:houseId", findByHouseId);
houseResidentRoute.put("/:id", update);

export default houseResidentRoute;
