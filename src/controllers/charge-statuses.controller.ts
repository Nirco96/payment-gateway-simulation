import {Request, Response} from "express";
import {getDeclinedChargesForMerchant} from "../models/charge-statuses.model";

const chargeStatusesController = {
  get: (req: Request, res: Response) => {
    const merchant_identifier = req.header('merchant_identifier');

    res.send(getDeclinedChargesForMerchant(merchant_identifier));
  }
}

export default chargeStatusesController;