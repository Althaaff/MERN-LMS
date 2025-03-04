import express from "express";

import {
  createOrder,
  capturePaymentAndFinalizeOrder,
} from "../../controllers/student-controller/order.controller.js";

const router = express.Router();

router.route("/create").post(createOrder);
router.route("/capture").post(capturePaymentAndFinalizeOrder);

export default router;
