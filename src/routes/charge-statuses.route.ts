import {Router} from "express";
import {chargeStatusesValidators} from "../models/charge-statuses.model";
import chargeStatusesController from "../controllers/charge-statuses.controller";

const router = Router();
router.get('/', chargeStatusesValidators, chargeStatusesController.get);

export default router;