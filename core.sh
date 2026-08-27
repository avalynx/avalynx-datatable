#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env.local"
ENV_FILE_FALLBACK="$PROJECT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    source "$ENV_FILE"
elif [[ -f "$ENV_FILE_FALLBACK" ]]; then
    # shellcheck disable=SC1090
    source "$ENV_FILE_FALLBACK"
fi

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$PROJECT_DIR")}"
CONTAINER="${PROJECT_NAME}-web-1"
COMPOSE=(docker compose --project-directory "$PROJECT_DIR")
if [[ -f "$ENV_FILE" ]]; then
    COMPOSE+=(--env-file "$ENV_FILE")
fi

usage() {
    cat <<EOF
Usage: $0 <command> [args]

Commands:
  up              Build (if needed) and start containers in background
  down            Stop and remove containers
  build           Build all service images
  rebuild         Rebuild all images without cache
  restart         Restart all services
  logs [service]  Follow container logs (default: web)
  ps              List running services
  shell           Open bash shell in web container (as application)
  shell-root      Open bash shell in web container (as root)
  exec <cmd>      Run a command in web container (as application)
  npm <cmd>       Run npm command in web container (as application), e.g. '$0 npm test'
  status          Show container status and ports
  help            Show this help
EOF
}

cmd="${1:-help}"
shift || true

case "$cmd" in
    up)
        "${COMPOSE[@]}" up -d "$@"
        ;;
    down)
        "${COMPOSE[@]}" down "$@"
        ;;
    build)
        "${COMPOSE[@]}" build "$@"
        ;;
    rebuild)
        "${COMPOSE[@]}" build --no-cache "$@"
        ;;
    restart)
        "${COMPOSE[@]}" restart "$@"
        ;;
    logs)
        "${COMPOSE[@]}" logs -f "${1:-web}"
        ;;
    ps)
        "${COMPOSE[@]}" ps
        ;;
    shell)
        docker exec --user=application -it -w /app "$CONTAINER" bash
        ;;
    shell-root)
        docker exec --user=root -it -w /app "$CONTAINER" bash
        ;;
    exec)
        if [[ $# -eq 0 ]]; then
            echo "ERROR: 'exec' benötigt einen Befehl" >&2
            exit 1
        fi
        docker exec --user=application -w /app "$CONTAINER" "$@"
        ;;
    npm)
        if [[ $# -eq 0 ]]; then
            echo "ERROR: 'npm' benötigt einen Befehl" >&2
            exit 1
        fi
        docker exec --user=application -w /app "$CONTAINER" npm "$@"
        ;;
    status)
        echo "Project:   $PROJECT_NAME"
        echo "Container: $CONTAINER"
        echo "Env file:  ${ENV_FILE}"
        echo "HTTP:      http://localhost:${HTTP_PORT:-80}"
        echo "HTTPS:     https://localhost:${HTTPS_PORT:-443}"
        "${COMPOSE[@]}" ps
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo "ERROR: unbekannter Befehl: $cmd" >&2
        usage
        exit 1
        ;;
esac
