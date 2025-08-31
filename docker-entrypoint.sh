#!/bin/sh
set -e

# Default to production server if no command provided
if [ "$#" -eq 0 ]; then
    echo "🚀 Starting Node.js webapp in production mode"
    
    # Run database migrations if needed
    if [ -n "$DATABASE_URL" ]; then
        echo "📊 Running database migrations..."
        npx prisma migrate deploy || echo "⚠️ Migration failed, continuing..."
    fi
    
    # Start the application
    exec node src/server.js
fi

# Execute the command passed to the entrypoint
exec "$@"