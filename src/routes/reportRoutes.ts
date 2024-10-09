import express from "express";
import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/admin";
import { deleteReport, getDailyReport, getDateReport, getRoomReport } from "../controllers/report.controller";

const router = express.Router();

router.post('/daily', auth, isAdmin, getDailyReport)
router.post('/room-usage/:id', auth, isAdmin, getRoomReport)
router.post('/period', auth, isAdmin, getDateReport)
router.delete('/delete/:id', auth, isAdmin, deleteReport)

export default router;