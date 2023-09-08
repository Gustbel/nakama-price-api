const { getVusdPrice } = require('./onChain/vusdPriceFetcher.js');

async function getWhitelistPrice(index) {
    switch (index) {
        case 0:         // wSMR
            return 0.05
        case 1:         // vUSD
            return (await getVusdPrice())
        case 2:         // DEEPR
            return 0.10
        case 3:         // wIOTA
            return 0.17
        default:
          return 0.0
      }
}

module.exports = { getWhitelistPrice };