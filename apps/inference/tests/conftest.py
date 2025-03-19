# conftest.py
import logging
import socket
import threading
import time

import pytest
import torch

from memicos_inference.server import Config, load_model_and_saes

# HF token is in dot env.
# TEST_SAE_JSON_PATH = "saes.json"
# TEST_SAE_JSON_PATH = "saes.example.gpt2_small.json"

TEST_HOST = "127.0.0.1"  # 0.0.0.0 (Flasis more cool)
TEST_PORT = 5002
SECONDARY_TEST_PORT = 5003
TOKEN_LIMIT = 100
TEST_PROMPT = "Hello, world!"

TEST_RUNNING_MODEL_ID = "gemma-2-2b-it"
TEST_SAE_MODEL_ID = "gemma-2-2b"
TEST_SET_ID = "gemmascope-mlp-16k"
TEST_SAE_ID = "0-gemmascope-mlp-16k"
BOS_TOKEN_STR = "<bos>"


def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


if torch.cuda.is_available():
    DEVICE = "cuda"
    MODEL_DTYPE = "bfloat16"
    SAE_DTYPE = "float32"
elif torch.backends.mps.is_available():
    DEVICE = "mps"
    MODEL_DTYPE = "bfloat16"
    SAE_DTYPE = "float32"
else:
    DEVICE = "cpu"
    MODEL_DTYPE = "float32"
    SAE_DTYPE = "float32"


# Set up logging
@pytest.fixture(scope="session")
def logger():
    logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)


@pytest.fixture(scope="session")
def config():
    port = get_free_port()
    return Config(
        model_id=TEST_SAE_MODEL_ID,
        sae_sets=[TEST_SET_ID],
        port=port,
        token_limit=TOKEN_LIMIT,
        secret="secret",
        model_dtype=MODEL_DTYPE,
        sae_dtype=SAE_DTYPE,
        valid_completion_types=["DEFAULT", "STEERED"],
        device=DEVICE,
        override_model_id=TEST_RUNNING_MODEL_ID,
        include_sae=[r"^[0-1]-gemmascope-mlp-16k"],
        max_loaded_saes=2,
    )


@pytest.fixture(scope="function")
def parameterized_config(request):
    params = getattr(request, "param", {})
    port = get_free_port()
    return Config(
        model_id=params.get("SAE_MODEL_ID", TEST_SAE_MODEL_ID),
        sae_sets=[params.get("SET_ID", TEST_SET_ID)],
        port=port,
        token_limit=TOKEN_LIMIT,
        secret="secret",
        model_dtype=MODEL_DTYPE,
        sae_dtype=SAE_DTYPE,
        valid_completion_types=["DEFAULT", "STEERED"],
        device=DEVICE,
        override_model_id=params.get("RUNNING_MODEL_ID", TEST_RUNNING_MODEL_ID),
        include_sae=[r"^" + params.get("SAE_ID", TEST_SAE_ID)],
        max_loaded_saes=2,
    )


@pytest.fixture(scope="session")
def run_main(config):
    app, model, sae_manager, _ = load_model_and_saes(config)
    return app, model, sae_manager


@pytest.fixture(scope="session")
def app(run_main):
    app, _, _ = run_main
    return app


@pytest.fixture(scope="session")
def model(run_main):
    _, model, _ = run_main
    return model


@pytest.fixture(scope="session")
def sae_manager(run_main):
    _, _, sae_manager = run_main
    return sae_manager


@pytest.fixture(scope="session")
def running_server(app):
    def run_server():
        app.run(host=TEST_HOST, port=TEST_PORT, debug=False, use_reloader=False)

    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()

    # Give the server time to start up
    time.sleep(1)  # Adjust this as needed

    yield f"http://{TEST_HOST}:{TEST_PORT}"


@pytest.fixture(scope="function")
def parameterized_running_server(parameterized_config):
    app, model, sae_manager, _ = load_model_and_saes(parameterized_config)

    server_thread = None

    def run_server():
        nonlocal server_thread
        server_thread = threading.Thread(
            target=lambda: app.run(
                host=TEST_HOST,
                port=parameterized_config.PORT,
                debug=False,
                use_reloader=False,
            )
        )
        server_thread.daemon = True
        server_thread.start()

    run_server()

    time.sleep(1)  # Give the server time to start up

    yield f"http://{TEST_HOST}:{parameterized_config.PORT}"

    # Assuming your Flask app has a shutdown function
    if hasattr(app, "shutdown"):
        app.shutdown()
    if server_thread:
        server_thread.join(timeout=5)  # Wait for the thread to finish
