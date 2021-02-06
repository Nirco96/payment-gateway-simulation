import {check, header} from "express-validator";
import config from "../config";

export type Charge = {
  fullName: string;
  creditCardNumber: string;
  creditCardCompany: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

export const chargeValidators = [
  header('merchant-identifier').isString(),
  check('fullName').isString(),
  check('creditCardNumber').isCreditCard(),
  check('creditCardCompany').toLowerCase().isIn(config.creditProviders),
  check('expirationDate').custom((input) => config.dateRegex.test(input)),
  check('cvv').isString(),
  check('amount').isDecimal()
]