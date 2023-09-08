const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const { getWhitelistPrice } = require('./scripts/fetcherPrices/whitelistPrices.js');


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
      const whitelistAddressIndex = whitelist.indexOf(address)
      response[address] = {
        "usd": await getWhitelistPrice(whitelistAddressIndex)   // TODO: Put logic here
      };
    }
  }
  res.json(response);
});

app.get('/coins/contract/:address/market_chart/range', async (req, res) => {
  const contractAddress = req.params.address;
  const fromTimestamp = req.query.from;
  const toTimestamp = req.query.to;

  let response = {};
  if (!whitelist.includes(contractAddress)) {
    try {
      // If is not in the whitelist get price from Coingecko
      const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;
      const coinGeckoResponse = await axios.get(coinGeckoUrl);
      response = coinGeckoResponse.data;
    } catch (error) {
      response = { error: 'Error fetching data' }
    }
  } else {
    // If the address is in the whitelist here will be define the price of this asset
    const whitelistAddressIndex = whitelist.indexOf(contractAddress)
    response = {
      prices: [],
      market_caps: [],
      total_volumes: []
    };

    const price = await getWhitelistPrice(whitelistAddressIndex)

    let pivot = Number(fromTimestamp)
    while (pivot < Number(toTimestamp)) {
      response.prices.push([pivot * 1000, price]);
      response.market_caps.push([pivot * 1000, price * 50_000]);
      response.total_volumes.push([pivot * 1000, price * 5_000]);

      // update pivot
      pivot += 3_600    // 3_600 is 1 hour in sec
    }
  }
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});