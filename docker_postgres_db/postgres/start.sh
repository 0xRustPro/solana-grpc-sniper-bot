#!/bin/sh

# Start PostgreSQL in the background
postgres -c "config_file=/etc/postgresql/postgresql.conf" &

# Wait for PostgreSQL to be ready
until pg_isready; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 2
done

# Start gRPC scripts
cd /app/grpc
ts-node pumpfun-new-tokens-listener.ts &
ts-node pumpfun-bond-listener.ts &
ts-node pumpfun-trades-listener.ts &
ts-node pumpfun-wallet-tracker.ts &
ts-node pumpswap-wallet-tracker.ts &
ts-node pumpswap-migration-listener.ts &

# Keep container running
wait 