import { Router } from "express";
import {
  getAll,
  create,
  findOne,
  update,
} from "../controllers/house.controller.js";
import { validateHouseSchema } from "../middlewares/validators.js";

const houseRoute = Router();

houseRoute.get("/", getAll);
houseRoute.post("/", validateHouseSchema, create);
houseRoute.get("/:id", findOne);
houseRoute.put("/:id", update);

export default houseRoute;
