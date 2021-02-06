import {Charge} from "./charge.model";
import config from "../config";

export interface CreditProviderAPI<HInput, R> {
  url: string;
  getHeaders: (data?: HInput) => { headers: object };
  parseCharge: (charge: Charge) => any;
  handleResponse: (res: R, isError: boolean) => {error: string} | undefined;
}

const chargeIdentifierHeader = (data: Charge) => {
  let first = data.fullName.split(' ')[0];

  return {
    headers: {
      identifier: first
    }
  }
};

const VisaAPI: CreditProviderAPI<Charge, {chargeResult: "Success" | "Failure", resultReason: string}> = {
  url: config.creditProviderUrls['visa'],

  getHeaders: chargeIdentifierHeader,

  parseCharge: (charge: Charge) => {
    return {
      fullName: charge.fullName,
      number: charge.creditCardNumber,
      expiration: charge.expirationDate,
      cvv: charge.cvv,
      totalAmount: charge.amount
    }
  },

  handleResponse: (res, isError: boolean) => {
    return res.chargeResult === "Success" ? undefined : {error: res.resultReason};
  }
}

const MasterCardAPI: CreditProviderAPI<Charge, {decline_reason: string}> = {
  url: config.creditProviderUrls['mastercard'],

  getHeaders: chargeIdentifierHeader,

  parseCharge: (charge: Charge) => {
    let [first, last] = charge.fullName.split(' ');
    return {

      first_name: first,
      last_name: last,
      card_number: charge.creditCardNumber,
      expiration: charge.expirationDate.split('/').join('-'),
      cvv: charge.cvv,
      charge_amount: charge.amount

    }
  },

  handleResponse: (res, isError: boolean) => {
    return isError ? {error: res.decline_reason} : undefined;
  }
}

interface CreditProviders {
  [provider: string]: CreditProviderAPI<unknown, unknown>
}

const creditProviders: CreditProviders = {
  visa: VisaAPI,
  mastercard: MasterCardAPI
}

export default creditProviders;