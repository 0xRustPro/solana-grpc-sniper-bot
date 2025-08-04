
## Prerequisites
- Docker Desktop installed
- Docker Compose Command line tool installed

## Quick Start

1. Clone the repository and navigate to this directory:
```bash
cd docker_postgres_db
```

2. Create `.env` file with your database credentials:
```env
POSTGRES_USER=trading_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=trading_db
```

3. Start the database:
```bash
docker-compose up -d
```

4. Verify the setup:
```bash
# Check if container is running
docker ps

# Connect to database
docker exec -it solana_trading_db psql -U trading_user -d trading_db

# Inside psql, verify schema and tables:
\dn                # List schemas
\dt sol_algo.*    # List tables in sol_algo schema
```

## Database Schema

The database includes the `sol_algo` schema with the following tables:
   ```sql
   -- Partitioned Tables
   sol_algo.pumpfun_trades_partitioned
   sol_algo.pumpfun_latest_tokens_partitioned
   
   -- Regular Tables
   sol_algo.pumpfun_graduate_detection
   sol_algo.pumpswap_migrated_pool
   sol_algo.pumpfun_launch_txn
   sol_algo.pumpswap_bought_history
   sol_algo.pumpfun_bought_history
   ```

## Common Commands

### Start the Database
```bash
docker-compose up -d
```

### Stop the Database
```bash
docker-compose down
```

### Reset Database (Clear All Data)
```bash
docker-compose down
rm -rf data/*
docker-compose up -d
```

### View Logs
```bash
docker logs solana_trading_db
```

### Connect to Database
```bash
docker exec -it solana_trading_db psql -U trading_user -d trading_db
```

## Troubleshooting

### Permission Issues
If you encounter permission issues:
```bash
# Fix permissions on init scripts
chmod 755 postgres/init-scripts/*
```

### Container Won't Start
Check the logs:
```bash
docker logs solana_trading_db
```

### Database Won't Initialize
Try rebuilding:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Maintenance

### Backup Database
```bash
docker exec -t solana_trading_db pg_dumpall -c -U trading_user > dump_$(date +%Y-%m-%d_%H_%M_%S).sql
```

### Restore Database
```bash
cat your_dump.sql | docker exec -i solana_trading_db psql -U trading_user -d trading_db
```

## Security Notes
- Never commit `.env` file with real credentials
- Change default passwords in production
- Restrict network access in production environments
- Regularly backup your data

## Contributing
Feel free to submit issues and enhancement requests!