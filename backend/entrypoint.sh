#!/bin/sh
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /app/tmp/pids/server.pid

# Wait for database to be ready
echo "Waiting for database to be ready..."
until pg_isready -h ${POSTGRES_HOST:-postgres} -U ${POSTGRES_USER:-postgres}; do
  echo "Database is unavailable - sleeping"
  sleep 2
done
echo "Database is ready!"

# Run database setup
echo "Setting up database..."
bundle exec rails db:prepare

# Then exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@" 