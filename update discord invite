![Solana Trading CLI Logo](https://github.com/outsmartchad/solana-trading-cli/blob/typescript-main/assets/sol-repo.jpg)

# Solana Trading CLI
A simple, fast, powerful Library for building custom trading strategies on Solana. It's built for speed, variety, and real-time data, using Cutting-edge Tech. Here's what you get:

- Uses low-latency systems like Jito, BloXroute, and Nozomi to execute trades,

- Read/write Pumpfun data in a local postgreSQL db.

- Supports DEXs like Raydium, Orca, Meteora, and Pump.fun for more trading options.

- Streams transactions and/or accounts state from a third-party's geyser gRPC node.

- Fetches account state info via optimized RPC methods.

This bot fits into your trading system, perfect for newbies.

# Core Components

## Token Creation and Multi-DEX Support
Create your own Solana SPL tokens on mainnet via Pump.fun and swap tokens across multiple decentralized exchanges:

| Exchange | Documentation |
|----------|---------------|
| Jupiter  | [CLI & trading functions guide](https://github.com/outsmartchad/solana-trading-cli/blob/typescript-main/src/jupiter/README.md) |
| Raydium   | [CLI & trading functions guide](https://github.com/outsmartchad/solana-trading-cli/blob/typescript-main/src/raydium/README.md) |
| Orca      | [CLI & trading functions guide](https://github.com/outsmartchad/solana-trading-cli/blob/typescript-main/src/orca/README.md) |
| Meteora   | [CLI & trading functions guide](https://github.com/outsmartchad/solana-trading-cli/blob/typescript-main/src/meteora/README.md) |
| Pump.fun  | Integrated support |


## Local Database Setup (In Development)

The project includes a PostgreSQL database for storing Pump.fun trading data and market analysis. For detailed setup instructions, see [Database Documentation](docker_postgres_db/README.md).

Quick setup:
```bash
# Navigate to database directory
cd docker_postgres_db

# Create environment file
cp .env.example .env

# Start database
docker-compose up -d
```


## Low-Latency Infrastructure
Accelerate transaction finality using Jito and bloXroute for lightning-fast trades. Both capable of pushing your trasaction faster then any other service provider on the market

| Provider | Description |
|----------|---------------|
| Jito      | Fast trascation and optimizes transaction ordering and execution specifically |
| Bloxroute | Fast trascation and accelerates transaction propagation |
| Nozomi    | Optimzed tx submission to current blockleader |


The database stores:
- Trading history and limit orders
- Token tracking and pool migrations
- Market analysis and transaction data


## Open-Source Geyser gRPC Bots
Leverage our cutting-edge, open-source gRPC trading bots:

| Bot Name | Features | Source |
|----------|----------|--------|
| gRPC Pump.fun Sniper Bot | Ultra-low latency (0.4-2 seconds) | [View source](https://github.com/outsmartchad/solana-trading-cli/tree/typescript-main/src/grpc_streaming_dev/grpc-pf-sniper) |
| gRPC Copy Bot | Replicate successful trading strategies | [View source](https://github.com/outsmartchad/solana-trading-cli/tree/typescript-main/src/grpc_streaming_dev/grpc-copy-bot) |
| gRPC Raydium Sniper Bot | Optimized for Raydium DEX | [View source](https://github.com/outsmartchad/solana-trading-cli/tree/typescript-main/src/grpc_streaming_dev/grpc-raydium-sniper) |


## Real-Time Market Data
Fetch critical metrics for any liquidity pool in real-time with RPC calls:
- Price
- LP-burn percentage
- Pool reserve
- Market cap


### Extensibility
Our comprehensive toolkit provides everything you need to create your own custom trading bot, tailored to your unique strategies and requirements.

## 🛠️ Installation
Follow these steps to get your development environment set up:

1. **Clone the repository**
   ```bash
   git clone https://github.com/outsmartchad/solana-trading-cli.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd solana-trading-cli
   ```

3. **Install the correct Node.js version**
   ```bash
   nvm install
   nvm use
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the test script**
   ```bash
   ts-node test.ts
   ```

### Installation Prerequisites

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Troubleshooting

If you encounter any issues during installation, please check our [FAQ](link-to-faq) or [open an issue](https://github.com/outsmartchad/solana-trading-cli/issues).

## 🚨 Set Up 

Before you begin, ensure you have completed the following steps:

### 1. Environment Configuration

1. Locate the template file:
   ```
   src/helpers/.env.example
   ```

2. Copy this file and rename it to `.env` in the same directory.

3. Open the `.env` file and add the following required information:
   - Mainnet wallet secret key (required)
   - RPC endpoint (required)
   - Custom Jito fee (if needed)

4. Optional configurations:
   - Devnet wallet secret key
   - Helius RPC url + key (e.g. getting latest price from dexes)
   - Shyft geyser gRPC token (for grpc trading bots development) (Link to Shyft: https://shyft.to/)

### 2. API Keys and Wallet Setup

- **Solana Wallet**: Ensure you have a funded Solana mainnet wallet. The secret key is required for mainnet transactions.
- **RPC Endpoint**: Obtain a RPC endpoint from reliable node operator like Helius to connect to Solana
- **Jito Integration**: If uses Jito, prepare your custom fee configuration.
- **Shyft Geyser gRPC** (Optional): If you are developing algo trading bot, buy a grpc token from reliable operator like Shyft.

### 3. Final Check

- Confirm that your `.env` file is properly configured and saved.
- Ensure the `.env` file is in the correct location: `src/helpers/.env`
- Verify that you haven't accidentally committed your `.env` file to version control.

> ⚠️ **Security Note**: Never share or commit your `.env` file or any private keys. The `.env` file is included in `.gitignore` for your safety.

For any issues with configuration, please refer to our [Troubleshooting Guide](link-to-troubleshooting) or [open an issue](https://github.com/yourusername/your-repo-name/issues).

## 🤝 Feedback and Contributions
We've made every effort to implement all the main aspects of solana trading in the best possible way. However, the development journey doesn't end here, and your input is crucial for our continuous improvement.

> [!IMPORTANT]
> Whether you have feedback on features, have encountered any bugs, or have suggestions for enhancements, we're eager to hear from you. Your insights help us make the Solana Trading Client library more robust and user-friendly.

Please feel free to contribute by submitting an issue, joining the discussions, or joining our discord. Each contribution helps us grow and improve.

We appreciate your support and look forward to making our product even better with your help!

### How to Contribute

- Contributions is wellcome!!!
- Fork it
- `git checkout -b feature/YourNewFeature`
- `git commit -m 'bug Fixed/added new feature'`
- `git push origin feature/YourNewFeature`
- And Please open a pull request

### Apply Latest Changes from remote repo

- `git stash -u  # Stash your changes`
- `git pull --rebase # Pull the latest changes`
- `git stash pop # Apply Your stashed changes`

## ✅ Credits

- https://github.com/raydium-io/raydium-sdk-V2
- https://github.com/rckprtr/pumpdotfun-sdk
- https://github.com/rpcpool/yellowstone-grpc
- https://github.com/Al366io/solana-transactions-wrapper

## ‼️ Disclaimer

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

**Use at your own risk.** The authors take no responsibility for any harm or damage caused by the use of this software. Users are responsible for ensuring the suitability and safety of this software for their specific use cases.

By using this software, you acknowledge that you have read, understood, and agree to this disclaimer.

### Discord channel: https://discord.gg/xcup2wtv

### If you think this will steal your keys, i have no time to convince you to use it.

## 🤖 Plans

- A local-based db to store your limit orders ✅

- Smart scripts to help you detect potential rug pulls on pump.fun, e.g. dev sold, master wallet, similar past rug patterns

- More gRPC bots to come ✅

- More algos to trade on raydium/Pump.fun

- Make it more easier to install, deploy the bot using docker ✅

## 🪙 Final State of this repo

- Best trading framework on Solana

- Best package/library for trading development on solana, e.g.(we could make it easy to like Raydium.buy("token", 0.01sol, 1%slippage))

- Best open-soured trading bot

- Succeed with Solana dev!
