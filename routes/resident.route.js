import { Router } from "express";
import {
  getAll,
  create,
  findOne,
  update,
  destroy,
} from "../controllers/resident.controller.js";
import { validateResidentSchema } from "../middlewares/validators.js";
import multer from "multer";

const upload = multer();

const residentRoute = Router();

residentRoute.get("/", getAll);
residentRoute.post("/", upload.single("ktp"), validateResidentSchema, create);
residentRoute.get("/:id", findOne);
residentRoute.put("/:id", upload.single("ktp"), update);
residentRoute.delete("/:id", destroy);

export default residentRoute;
