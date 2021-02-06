import {Request, Response} from "express";
import {validationResult} from "express-validator";
import logger from "../util/logger";
import creditProviders, {CreditProviderAPI} from "../models/credit-provider.model";
import {Charge} from "../models/charge.model";
import axios, {AxiosError} from "axios";
import config from "../config";
import {saveDeclinedCharge} from "../models/charge-statuses.model";

const chargeController = {
  post: (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(400);
    } else {
      const charge = req.body as Charge;
      const identifier: string = req.header('merchant-identifier');
      const creditProvider = creditProviders[charge.creditCardCompany];

      performChargeRetry(creditProvider, charge, res, identifier);
    }
  }
}

const saveIfDeclined = (providerResponse: { error: string } | undefined, merchant: string) => {
  if (providerResponse)
    saveDeclinedCharge(providerResponse.error, merchant);
}

const performChargeRetry = (creditProvider: CreditProviderAPI<unknown, unknown>,
                            charge: Charge,
                            res: Response,
                            merchant: string,
                            attempt: number = 1) => {
  const last4d = charge.creditCardNumber.slice(-4);
  logger.info(`Charging card ${last4d} from ${charge.creditCardCompany}...`)

  axios.post(creditProvider.url, creditProvider.parseCharge(charge), creditProvider.getHeaders(charge))
    .then((result) => {
      const providerResponse = creditProvider.handleResponse(result.data, false);
      saveIfDeclined(providerResponse, merchant);
      res.status(200).send(providerResponse ? config.clientError : 'OK');
      logger.info(`Charging card ${last4d} result: ${providerResponse ? 'declined' : 'success'}`)
    })
    .catch((error: AxiosError) => {
      if (error.response && config.businessErrorStatuses.includes(error.response.status)) {

        const providerResponse = creditProvider.handleResponse(error.response.data, true);
        saveDeclinedCharge(providerResponse.error, merchant)

        res.status(200).send(config.clientError);
        logger.info(`Charging card ${last4d} result: declined`)

      } else if (attempt <= config.chargeRetryCount) {

        let delay = Math.pow(attempt, 2) * 1000;

        logger.warn(`Failed to charge card ${last4d}, attempts: ${attempt} next try in: ${delay}ms`);

        setTimeout(() => {
          return performChargeRetry(creditProvider, charge, res, merchant, attempt + 1);
        }, delay)

      } else {
        logger.error(`Failed to charge card ${last4d}`);

        return res.sendStatus(500);
      }
    });
}

export default chargeController;