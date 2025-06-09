import express, { Router } from "express";
import { adminaccess, protectRoute } from "../middleWare/authMiddleWare/protectRoute";
const router = express.Router();
router.use(protectRoute);

router.use(adminaccess);

router.post("/getIncome",getIncome);

router.post("/getNoOfStudents",getNoOfStudents);

router.post("/getNoOfInstructors",getNoOfInstructors);


