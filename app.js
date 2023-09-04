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

app.get('/coins/contract/:address/market_chart/range', (req, res) => {
  const address = req.params.address;
  const vsCurrency = req.query.vs_currency;
  const from = req.query.from;
  const to = req.query.to;

  // Implementa la lógica para obtener los datos de mercado según el contrato y el rango de tiempo

  const responseData = {
    prices: [
      [1693854122128, 1855.727988281606],
      [1693854370419, 1853.0540327201713],
      [1693854701571, 1853.791320764839]
    ],
    market_caps: [
      [1693854122128, 0.0],
      [1693854370419, 0.0],
      [1693854701571, 0.0]
    ],
    total_volumes: [
      [1693854122128, 31512018.50055088],
      [1693854370419, 31455834.45837046],
      [1693854701571, 31467919.52530859]
    ]
  };

  res.json(responseData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
