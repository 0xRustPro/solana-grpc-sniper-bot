FROM postgres:16-alpine

# Install Node.js and npm
RUN apk add --update nodejs npm

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Create directory first
RUN mkdir -p /etc/postgresql

# Add custom configurations
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Create directory for gRPC scripts
RUN mkdir -p /app/grpc

# Copy gRPC scripts
COPY ../grpc/ /app/grpc/

# Install dependencies for gRPC scripts
WORKDIR /app/grpc
COPY package.json .
RUN npm install

# Set proper permissions (make postgres user own the config)
RUN chown postgres:postgres /etc/postgresql/postgresql.conf && \
    chmod 600 /etc/postgresql/postgresql.conf && \
    chmod -R 755 /docker-entrypoint-initdb.d/

    # Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Use custom start script
CMD ["/start.sh"] 
