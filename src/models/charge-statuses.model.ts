import {header} from "express-validator";

// This should probably be in a DB somewhere...
const chargeStatusesMap = new Map<string, Map<string, number>>();

export const saveDeclinedCharge = (reason: string, merchant: string) => {
  if (!chargeStatusesMap.has(merchant)) {
    chargeStatusesMap.set(merchant, new Map<string, number>([[reason, 1]]));
  } else {
    const merchantMap = chargeStatusesMap.get(merchant);

    if (!merchantMap.has(reason)) {
      merchantMap.set(reason, 1);
    } else {
      merchantMap.set(reason, merchantMap.get(reason) + 1);
    }
  }
}

export const getDeclinedChargesForMerchant = (merchant: string) => {
  return chargeStatusesMap.get(merchant) ? Array.from(chargeStatusesMap.get(merchant).entries())
    .map((reasonCountPair: [string, number]) => {return {reason: reasonCountPair[0], count: reasonCountPair[1]}}) : [];
}

export const chargeStatusesValidators = [
  header('merchant-identifier').isString()
]