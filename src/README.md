# helper commands
1. ts-node wrap_sol.js --size <size> # Wrap SOL to WSOL
2. ts-node unwrap_sol.js # Unwrap WSOL to SOL

# Meteora
1. ts-node buy --token <ADDRESS_TOKEN> --sol <NUMBER_OF_SOL>
2. ts-node sell --token <ADDRESS_TOKEN> --percentage <SELL_PERCENTAGE>

# Orca
1. ts-node buy --token <ADDRESS_TOKEN> --sol <NUMBER_OF_SOL>
2. ts-node sell --token <ADDRESS_TOKEN> --percentage <SELL_PERCENTAGE>

# Raydium
1. ts-node buy --token <ADDRESS_TOKEN> --sol <NUMBER_OF_SOL>
2. ts-node sell --token <ADDRESS_TOKEN> --percentage <SELL_PERCENTAGE>

# Pump.fun
1. ts-node buy --token_address <ADDRESS_TOKEN> --sol <NUMBER_OF_SOL>
2. ts-node sell --token_address <ADDRESS_TOKEN> --percentage <SELL_PERCENTAGE>
3. ts-node createAndBuy --pathToMintKeypair <PATH_TO_MINT_KEYPAIR> --sol <NUMBER_OF_SOL> --name <TOKEN_NAME> --symbol <TOKEN_SYMBOL> --description <TOKEN_DESCRIPTION> --telegram <TELEGRAM_LINK> --twitter <TWITTER_LINK> --website <WEBSITE_LINK> --file <FILE_PATH>

# Token 
1. ts-node create --payer <PATH_TO_SECRET_KEY> --symbol <TOKEN_SYMBOL> --token_name <TOKEN_NAME> --mint <PATH_TO_MINT_KEYPAIR> --supply <SUPPLY_OF_TOKEN> --decimals <DECIMALS> --metadata <PATH_METADATA_JSON> --image <PATH_TO_IMAGE> --cluster <CLUSTER> --priority-fee <PRIORITY_FEE> --file_type <FILE_TYPE>
2. ts-node burn --payer <PATH_TO_SECRET_KEY> --token_address <ADDRESS_TOKEN> --percentage <BURN_PERCENTAGE> --cluster <CLUSTER>

# gRPC projects
- copy-bot: ts-node copy-trade.ts --trader <TRADER_ADDRESS_TO_COPY>
- pf-sniper-bot: ts-node snipe-create.ts --token <TOKEN_ADDRESS> --sell-after <SELL_TOKEN_AFTER_NUMBER_OF_BUYS> --n <NUMBER_OF_TOKEN_TO_SNIPE> --auto-sell --jito