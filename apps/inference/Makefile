.PHONY: test test-verbose coverage lint format unit-test integration-test check-ci

# Variables
PYTHON = python
POETRY = poetry
PYTEST = $(POETRY) run pytest
PYTEST_ARGS = -v -s
COVERAGE = $(POETRY) run coverage
FLAKE8 = $(POETRY) run flake8
BLACK = $(POETRY) run black

# Targets
test: unit-test integration-test

unit-test:
	$(POETRY) run $(PYTEST) $(PYTEST_ARGS) tests/unit

integration-test:
	$(POETRY) run $(PYTEST) $(PYTEST_ARGS) tests/integration

test-verbose:
	$(POETRY) run $(PYTEST) $(PYTEST_ARGS) -vv

coverage:
	$(COVERAGE) run -m pytest
	$(COVERAGE) report -m

lint:
	$(FLAKE8) memicos_inference tests

format:
	$(BLACK) --line-length 79 --target-version py311 memicos_inference tests

check-ci: lint format unit-test

install:
	$(POETRY) config virtualenvs.create true
	$(POETRY) install

install-dev:
	$(POETRY) config virtualenvs.create true
	$(POETRY) install --with dev

all: install-dev format lint test coverage

run-server:
	$(POETRY) run python server.py