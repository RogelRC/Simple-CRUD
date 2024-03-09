import { Router } from "express";
import { crudController } from "../controllers/crud.controller.js";

const router = Router();

router.get("/getUsers", crudController.getUsers);
router.post("/createUser", crudController.createUser);
router.delete("/deleteUser", crudController.deleteUser);
router.get("/getByID", crudController.getByID);
router.post("/updateUser", crudController.updateUser);

export default router;