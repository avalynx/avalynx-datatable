#!/bin/bash
PROJECT_DIR=$PWD
source "$PROJECT_DIR"/.env
docker exec --user=application -it -w /app "${COMPOSE_PROJECT_NAME}"-web-1 bash