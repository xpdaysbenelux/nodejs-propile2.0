#!bin/bash

# Seed if dev
if [[ "$NODE_ENV" == 'development' ]];
then
    # Drops db, migrates & seeds.
    yarn db:rollup && yarn seed:all
else
    # Don't seed, just run migrations.
    yarn migrate && yarn seed:prod
fi
