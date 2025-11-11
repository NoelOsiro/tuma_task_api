.PHONY: dev-up dev-down logs

dev-up:
	@echo "Starting local development stack..."
	cd backend && docker compose up -d

dev-down:
	@echo "Stopping local development stack..."
	cd backend && docker compose down

logs:
	@echo "Tailing logs for services..."
	cd backend && docker compose logs -f
