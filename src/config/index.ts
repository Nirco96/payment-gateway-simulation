const config = {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  dateRegex: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
  creditProviders: ['visa', 'mastercard'],
  creditProviderUrls: {
    'visa': `https://interview.riskxint.com/visa/api/chargeCard`,
    'mastercard': `https://interview.riskxint.com/mastercard/capture_card`
  },
  chargeRetryCount: 3,
  clientError: {error: "Card declined"},
  businessErrorStatuses: [400]
};


export default config;
