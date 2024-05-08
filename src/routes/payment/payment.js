import { Router } from "express";
import {
  getpayment,
} from "../../controllers/payment/payment.js";
const router = Router();


router.post("/getpayment", getpayment);


export default router;
