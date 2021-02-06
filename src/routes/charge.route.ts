import { Router } from 'express';
import chargeController from "../controllers/charge.controller";
import {chargeValidators} from "../models/charge.model";

const router = Router();
router.post('/', chargeValidators, chargeController.post);

export default router;
