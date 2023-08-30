const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/simple/token_price/:network', (req, res) => {
  const network = req.params.network;
  const contractAddresses = req.query.contract_addresses.split(',');
  const vsCurrencies = req.query.vs_currencies;

  // Here, you can implement the logic to fetch token prices
  // and construct the JSON response similar to CoinGecko

  const response = {};

  for (const address of contractAddresses) {
    response[address] = {
      [vsCurrencies]: 1952.74 // This is just an example; you should calculate the actual value
    };
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
