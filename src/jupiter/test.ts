import { getCurrentPriceInSOL, getCurrentPriceInUSD } from "./fetch-price";
async function main() {
  const tokenAddress = "2SEUhUGpKMPuyDysMFfKNRLBxVf9kG2xBxW16FVopump";
  const currentPopcatPriceInSOL = await getCurrentPriceInSOL(tokenAddress);
  const currentPopcatPriceInUSD = await getCurrentPriceInUSD(tokenAddress);
  console.log(`Current price in SOL: ${currentPopcatPriceInSOL}`);
  console.log(`Current price in USD: ${currentPopcatPriceInUSD}`);
}

main();
