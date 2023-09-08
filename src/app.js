const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const { getVusdPrice } = require('./scripts/fetcherPrices/onChain/vusdPriceFetcher.js');


// Load whitelist address list from JSON file
const whitelist = JSON.parse(fs.readFileSync('whitelist.json', 'utf8'));

// TODO: This is ONLY FOR DEV PURPOUSES - Setting prices of the whitelist
const whitelistPrices = [
          0.05,             // wSMR
          getVusdPrice(),   // vUSD
          0.10,             // DEEPR
          0.17              // wIOTA
]
whitelistPrices.push(...Array(Math.max(0, whitelist.length - whitelistPrices.length)).fill(0.0)); // This line prevents there from being more addresses than prices


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
        "usd": whitelistPrices[whitelistAddressIndex]   // TODO: Put logic here
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

    let pivot = Number(fromTimestamp)
    while (pivot < Number(toTimestamp)) {
      response.prices.push([pivot * 1000, whitelistPrices[whitelistAddressIndex]]);
      response.market_caps.push([pivot * 1000, whitelistPrices[whitelistAddressIndex] * 50_000]);
      response.total_volumes.push([pivot * 1000, whitelistPrices[whitelistAddressIndex] * 5_000]);

      // update pivot
      pivot += 3_600    // 3_600 is 1 hour in sec
    }
  }
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});