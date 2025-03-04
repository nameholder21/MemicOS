help:  ## Show available commands
	@echo "In general, the pattern for the commands is [action]-[app]-[environment]. For example, 'make build-webapp-demo' will build the webapp for the demo environment."
	@awk 'BEGIN {FS = ":.*## "; printf "\nAvailable commands:\n\n"} /^[a-zA-Z_-]+:.*## / { printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init-env: ## Initialize the environment
	@echo "Initializing environment..."
	@if [ -f .env ]; then \
		read -p "'.env' file already exists. Do you want to overwrite it? (y/N) " confirm; \
		if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
			echo "Aborted."; \
			exit 1; \
		fi; \
	fi
	cp .env.example .env
	@read -p "Enter your OpenAI API key - this is optional, but it is required for Search Explanations to work (press Enter to skip): " api_key; \
	if [ ! -z "$$api_key" ]; then \
		echo "OPENAI_API_KEY=$$api_key" >> .env; \
		echo "OpenAI API key added to .env"; \
	else \
		echo "No API key provided. The Search Explanations feature will not work."; \
	fi
	@read -p "Enter your Hugging Face token - this is optional, but it is required for access to gated HuggingFace models (press Enter to skip): " hf_token; \
	if [ ! -z "$$hf_token" ]; then \
		echo "HF_TOKEN=$$hf_token" >> .env; \
		echo "Hugging Face token added to .env"; \
	else \
		echo "No Hugging Face token provided. Gated models may not be accessible."; \
	fi
	@echo "Environment initialized successfully."

build-webapp-demo: ## Build Webapp - Public Demo Environment
	@echo "Building the webapp for connecting to the public demo database and servers..."
	@if ! command -v docker &> /dev/null; then \
		echo "Error: Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	ENV_FILE=.env.demo docker compose build webapp

run-webapp-demo: ## Run Webapp - Public Demo Environment
	@echo "Bringing up the webapp and connecting to the demo database..."
	@if ! command -v docker &> /dev/null; then \
		echo "Error: Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	ENV_FILE=.env.demo docker compose --env-file .env.demo --env-file .env up webapp


check-webapp-demo: ## Check Webapp - Public Demo Environment
	@echo "Printing the webapp configuration - this is useful to see if your environment variables are set correctly."
	ENV_FILE=.env.demo docker compose config webapp


build-webapp-localhost: ## Build Webapp - Localhost Environment
	@echo "Building the webapp for connecting to the localhost database..."
	@if ! command -v docker &> /dev/null; then \
		echo "Error: Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	ENV_FILE=.env.localhost docker compose build webapp db-init postgres

run-webapp-localhost: ## Run Webapp (Production Build) - Localhost Environment
	@echo "Bringing up the webapp and connecting to the localhost database..."
	@if ! command -v docker &> /dev/null; then \
		echo "Error: Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	ENV_FILE=.env.localhost docker compose --env-file .env.localhost --env-file .env up webapp db-init postgres

install-nodejs:
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
	# Need to source NVM in the same shell
	. ${HOME}/.nvm/nvm.sh && nvm install 22

install-webapp-localhost: ## Install Webapp Dependencies for Development - Localhost Environment
	@echo "Installing the webapp dependencies for development in the localhost environment..."
	cd apps/webapp && \
	npm install
	
dev-webapp-localhost: ## Run Webapp for Development - Localhost Environment
	@echo "Bringing up the webapp for development and connecting to the localhost database..."
	@if ! command -v docker &> /dev/null; then \
		echo "Error: Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	ENV_FILE=.env.localhost docker compose -f docker-compose.yaml -f webapp-dev.yaml --env-file .env.localhost --env-file .env up webapp db-init postgres

install-inference-localhost: ## Install Inference Dependencies for Development - Localhost Environment
	@echo "Installing the inference dependencies for development in the localhost environment..."
	cd apps/inference && \
	poetry install

dev-inference-localhost: ## Run Inference Server for Development - Localhost Environment. Usage: make dev-inference-localhost [MODEL_SOURCESET=gpt2-small.res-jb] [NO_RELOAD=1]
	@echo "Bringing up the inference server for development in the localhost environment..."
	@if [ "$(MODEL_SOURCESET)" != "" ]; then \
		echo "Using model configuration: .env.inference.$(MODEL_SOURCESET)"; \
		cd apps/inference && env $$(cat ../../.env.inference.$(MODEL_SOURCESET) | xargs) poetry run uvicorn memicos_inference.server:app --host 0.0.0.0 --port 5002 $${NO_RELOAD:+} $${NO_RELOAD:---reload}; \
	else \
		echo "Error: MODEL_SOURCESET not specified. Please specify a model+source configuration, e.g. to load .env.inference.gpt2-small.res-jb, run: make dev-inference-localhost MODEL_SOURCESET=gpt2-small.res-jb"; \
		exit 1; \
	fi

reset-docker-data: ## Reset Docker Data - this deletes your local database!
	@echo "WARNING: This will delete all your local memicos Docker data and databases!"
	@read -p "Are you sure you want to continue? (y/N) " confirm; \
	if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
		echo "Aborted."; \
		exit 1; \
	fi
	@echo "Resetting Docker data..."
	docker compose down -v
