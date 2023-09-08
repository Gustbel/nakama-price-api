const ethers = require('ethers');
const vaultAbi = require('./../../../abi/vault.json');
const tangleseaPairAbi = require('./../../../abi/tangleseaPair.json');

const wsmrPrice = 0.05
const usdtPrice = 1.02

// POOLS
const vaultAddress = "0x8021c957a0FF43ee4aF585D10a14bD14C30b89F7"
const pool1Id = "0x4bfd8353eddf067588d3a48389fcdbe3777f9ba4000200000000000000000008"
const pool2Id = '0xc800de05df867e81fcb3fddd16baf0ce4db64b70000000000000000000000009'

// SHIMMERSEA
//const shimmerSeaPool1Address = "0x4e924F6a6AC5452D6E1cB08818Fb103Fd0328eb0"
//const shimmerSeaPool2Address = "0xA27BEcBC6098363cB9784f41F001D74604fa75b1"


async function getVusdPrice() {
  const provider = new ethers.JsonRpcProvider('https://json-rpc.evm.testnet.shimmer.network');

  // Get price from Pools
  const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
  // Pool1
  const pool1PoolsRawInfo = await vault.getPoolTokens(pool1Id);
  const pool1PoolsWsmrBalance = Number(ethers.formatUnits(String(pool1PoolsRawInfo[1][0]), 18))
  const pool1PoolsVusdBalance = Number(ethers.formatUnits(String(pool1PoolsRawInfo[1][1]), 18))
  let poolCotization = pool1PoolsWsmrBalance/pool1PoolsVusdBalance
  const pool1PoolsVusdPrice = poolCotization * wsmrPrice
  const pool1PoolsCap = pool1PoolsWsmrBalance * wsmrPrice + pool1PoolsVusdBalance * pool1PoolsVusdPrice
  // Pool2
  const pool2PoolsRawInfo = await vault.getPoolTokens(pool2Id);
  const pool2PoolsUsdtBalance = Number(ethers.formatUnits(String(pool2PoolsRawInfo[1][0]), 6))
  const pool2PoolsVusdBalance = Number(ethers.formatUnits(String(pool2PoolsRawInfo[1][1]), 18))
  poolCotization = pool2PoolsUsdtBalance/pool2PoolsVusdBalance
  const pool2PoolsVusdPrice = poolCotization * usdtPrice
  const pool2PoolsCap = pool2PoolsUsdtBalance * usdtPrice + pool2PoolsVusdBalance * pool2PoolsVusdPrice

  /*
  // Get price from ShimmerSea
  // Pool1
  const shimmerSeaPool1 = new ethers.Contract(shimmerSeaPool1Address, tangleseaPairAbi, provider);
  const pool1SseaRawInfo = await shimmerSeaPool1.getReserves()
  const pool1SseaWsmrBalance = Number(ethers.formatUnits(String(pool1SseaRawInfo[0]), 18))
  const pool1SseaVusdBalance = Number(ethers.formatUnits(String(pool1SseaRawInfo[1]), 18))
  poolCotization = pool1SseaWsmrBalance/pool1SseaVusdBalance
  const pool1SseaVusdPrice = poolCotization * wsmrPrice
  const pool1SseaCap = pool1SseaWsmrBalance * wsmrPrice + pool1SseaVusdBalance * pool1SseaVusdPrice
  // Pool2
  const shimmerSeaPool2 = new ethers.Contract(shimmerSeaPool2Address, tangleseaPairAbi, provider);
  const pool2SseaRawInfo = await shimmerSeaPool2.getReserves()
  const pool2SseaUsdtBalance = Number(ethers.formatUnits(String(pool2SseaRawInfo[0]), 6))
  const pool2SseaVusdBalance = Number(ethers.formatUnits(String(pool2SseaRawInfo[1]), 18))
  poolCotization = pool2SseaUsdtBalance/pool2SseaVusdBalance
  const pool2SseaVusdPrice = poolCotization * usdtPrice
  const pool2SseaCap = pool2SseaUsdtBalance * usdtPrice + pool2SseaVusdBalance * pool2SseaVusdPrice
  */

  // Dominance calculation
  // temporal
  const pool1SseaCap = 0
  const pool2SseaCap = 0
  const pool1SseaVusdPrice = 0
  const pool2SseaVusdPrice = 0
  const pool1SseaVusdBalance = 0
  const pool2SseaVusdBalance = 0
  /////////

  const marketCap = pool1PoolsCap + pool2PoolsCap + pool1SseaCap + pool2SseaCap
  const pool1PoolsDominance = pool1PoolsCap / marketCap
  const pool2PoolsDominance = pool2PoolsCap / marketCap
  const pool1SseaDominance = pool1SseaCap /marketCap
  const pool2SseaDominance = pool2SseaCap /marketCap

  // Final Price
  const ponderatedPrice = 
        (pool1PoolsVusdPrice * pool1PoolsDominance) +
        (pool2PoolsVusdPrice * pool2PoolsDominance) +
        (pool1SseaVusdPrice * pool1SseaDominance) +
        (pool2SseaVusdPrice * pool2SseaDominance)

  return Number(ponderatedPrice.toFixed(3))
}

module.exports = { getVusdPrice };