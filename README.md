# Welcome to Payment Gateway Simulation!
This node.js server simulates a payment gateway api between clients and credit card companies.

# Getting started
- Install dependencies
```****
cd <project_name>
npm install
```

- Start server
```
npm start
```
For auto-reload (nodemon), use:
```
npm run watch-node
```

Or you can compile and serve js files
```
npm run compile
node ./dist/server.js
```


This will start the server on port **3000**.

# API Specification:
```
POST /api/charge - Charge the card from matching company
    Header: 
        merchant_identifier: string
    Body: {
        fullName: string,
        creditCardNumber: string,
        expirationDate: string,
        cvv: string
        amount: decimal
    }
GET /api/chargeStatuses - Get declined charges statistics for merchant
    Header:
        merchant_identifier
```