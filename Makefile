.PHONY: help run run-logs setup setup-prod stop rebuild

.DEFAULT: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36mmake %-20s\033[0m\n\t%s\n", $$1, $$2}'

run: stop  ## starts the application
	docker-compose up -d
	@echo "Localstack running: http://localhost:8080"
	@echo "App running: http://localhost:3000"

run-logs: stop  ## starts the application
	docker-compose up -d && docker-compose logs -f -t
	@echo "Localstack running: http://localhost:8080"
	@echo "App running: http://localhost:3000"

setup: ## setup resources
	./setup/local/s3.sh csv-streaming
	./setup/local/sqs.sh csv-streaming
	@echo "s3 bucket running: http://localhost:4572"
	@echo "sqs queue running: http://localhost:4576"

setup-prod: ## setup resources
	./setup/prod.sh csv-streaming
	@echo "Done"

start: ## starts application with nodemon
	npm run start
	@echo "App is running: http://0.0.0.0:3002"

test-s3: # log output from s3
	./testing/local/upload-file.sh
	npm run invoke:local:s3

test-sqs: # get stats from sqs queue
	./testing/local/sqs-queue-attributes.sh

stop:  ## stops the application
	docker-compose down
	@echo "Stopped the application."

rebuild: stop  ## rebuild and start the application
	docker-compose up -d --build
	@echo "Localstack running: http://localhost:8080"

