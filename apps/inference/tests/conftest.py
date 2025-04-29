import asyncio
import gc
import json
import os

import pytest
import torch
from fastapi.testclient import TestClient

import memicos_inference.server as server
from memicos_inference.args import parse_env_and_args
from memicos_inference.config import Config
from memicos_inference.sae_manager import SAEManager
from memicos_inference.server import app, initialize
from memicos_inference.shared import Model

BOS_TOKEN_STR = "<|endoftext|>"
TEST_PROMPT = "Hello, world!"
X_SECRET_KEY = "cat"


@pytest.fixture(scope="session")
def initialize_models():
    """
    Defining the global state of the app with a session-scoped fixture that initializes the model and SAEs.

    This fixture will be run once per test session and will be available to all tests
    that need an initialized model. It uses the same initialization logic as the
    /initialize endpoint.
    """
    # Set environment variables for testing
    os.environ.update(
        {
            "MODEL_ID": "gpt2-small",
            "SAE_SETS": json.dumps(["res-jb"]),
            "MODEL_DTYPE": "float16",
            "SAE_DTYPE": "float32",
            "TOKEN_LIMIT": "500",
            "DEVICE": "cpu",
            "INCLUDE_SAE": json.dumps(
                ["7-res-jb"]
            ),  # Only load the specific SAE we want
            "EXCLUDE_SAE": json.dumps([]),
            "MAX_LOADED_SAES": "1",
            "SECRET": X_SECRET_KEY ,  
        }
    )

    # Re-parse args after setting environment variables
    # This is important to refresh the module-level args in the server module
    server.args = parse_env_and_args()

    # Initialize the model and SAEs
    asyncio.run(initialize())

    yield

    # Cleanup
    Config._instance = None
    SAEManager._instance = None
    Model._instance = None  # type: ignore
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    gc.collect()


@pytest.fixture(scope="session")
def client(initialize_models: None):  # noqa: ARG001
    return TestClient(app)
