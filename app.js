const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Load whitelist address list from JSON file
const whitelist = JSON.parse(fs.readFileSync('whitelist.json', 'utf8'));

app.get('/simple/token_price/:network', async (req, res) => {
  const network = req.params.network;
  const contractAddresses = req.query.contract_addresses.split(',');

  let response = {};
  for (const address of contractAddresses) {
    if (!whitelist.includes(address)) {
      // If is not in the whitelist get price from Coingecko
      try {
        const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${address}&vs_currencies=usd`;
        const coinGeckoResponse = await axios.get(coinGeckoUrl);
        response[address] = coinGeckoResponse.data[address];
      } catch (error) {
        console.log(error)
      }
    } else {
      // If the address is in the whitelist here will be define the price of this asset
      response[address] = {
        "usd": 1.023   // TODO: Put logic here
      };
    }
  }
  res.json(response);
});

app.get('/coins/contract/:address/market_chart/range', async (req, res) => {
  const contractAddress = req.params.address;
  const from = req.query.from;
  const to = req.query.to;

  // Here, you can implement the logic to fetch token prices
  // and construct the JSON response similar to CoinGecko
  /*
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
  */

  // BYPASS TO COINGECKO
  let response = {};
  try {
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
    const coinGeckoResponse = await axios.get(coinGeckoUrl);
    response = coinGeckoResponse.data;
  } catch (error) {
    response = { error: 'Error fetching data' }
  }
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
