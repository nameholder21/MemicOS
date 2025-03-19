import json

import pytest
import requests

from tests.conftest import (
    BOS_TOKEN_STR,
    TEST_PROMPT,
    # TEST_SET_ID,
    TEST_SAE_ID,
    TEST_SAE_MODEL_ID,
)


def test_activations_test_endpoint(running_server, logger):
    base_url, log_capture_string = running_server

    # Function to print captured logs
    def print_logs():
        logger.info("Server Logs:")
        logger.info(log_capture_string.getvalue())
        log_capture_string.truncate(0)
        log_capture_string.seek(0)

    # Test activations_test endpoint
    url = f"{base_url}/activations-test"

    payload = {
        "text": TEST_PROMPT,
        "model": TEST_SAE_MODEL_ID,
        "layer": TEST_SAE_ID,
        "index": 0,  # Test with the first feature/neuron
        "secret": "secret",
    }

    response = requests.post(url, json=payload)

    # Print logs if the test fails
    if response.status_code != 200:
        print_logs()

    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"

    data = response.json()
    assert "activations" in data, "Response does not contain 'activations' key"
    assert "tokens" in data, "Response does not contain 'tokens' key"

    # Check activations structure
    activations = data["activations"]
    assert "values" in activations, "Activations missing 'values'"
    assert "maxValue" in activations, "Activations missing 'maxValue'"
    assert "maxValueIndex" in activations, "Activations missing 'maxValueIndex'"

    # Additional checks for DFA if enabled
    if "dfaValues" in activations:
        assert "dfaTargetIndex" in activations, "Activations missing 'dfaTargetIndex'"
        assert "dfaMaxValue" in activations, "Activations missing 'dfaMaxValue'"

    # Check tokens
    tokens = data["tokens"]
    assert len(tokens) > 0, "No tokens returned"
    assert tokens[0] == BOS_TOKEN_STR, f"First token is not '{BOS_TOKEN_STR}'"
    assert tokens[1] == "Hello", "Second token is not 'Hello'"

    logger.info("Test passed successfully")


@pytest.mark.parametrize(
    "parameterized_config",
    [
        {
            "RUNNING_MODEL_ID": "gpt2",
            "SAE_MODEL_ID": "gpt2-small",
            "SET_ID": "att-kk",
            "SAE_ID": "6-att-kk",
        }
    ],
    indirect=True,
)
def test_activations_test_with_dfa(
    parameterized_running_server, parameterized_config, logger
):
    base_url, log_capture_string = parameterized_running_server

    url = f"{base_url}/activations-test"
    payload = {
        "text": TEST_PROMPT,
        "model": parameterized_config.MODEL_ID,
        "layer": parameterized_config.include_sae_patterns[0].strip("^"),
        "index": 0,  # Test with the first feature/neuron
        "secret": "secret",
    }

    logger.info(
        f"Sending request to {url} with payload: {json.dumps(payload, indent=2)}"
    )

    response = requests.post(url, json=payload)

    try:
        data = response.json()
    except json.JSONDecodeError:
        pytest.fail("Response is not valid JSON")

    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"
    assert (
        "activations" in data
    ), f"Response does not contain 'activations' key. Keys found: {', '.join(data.keys())}"

    activations = data["activations"]
    assert "dfaValues" in activations, "DFA values not found in activations"
    assert "dfaTargetIndex" in activations, "DFA target index not found in activations"
    assert "dfaMaxValue" in activations, "DFA max value not found in activations"

    logger.info("Test passed successfully")


@pytest.mark.parametrize(
    "parameterized_config",
    [
        {
            "RUNNING_MODEL_ID": "gemma-2-2b-it",
            "SAE_MODEL_ID": "gemma-2-2b",
            "SET_ID": "gemmascope-att-16k",
            "SAE_ID": "12-gemmascope-att-16k",
        }
    ],
    indirect=True,
)
def test_activations_test_with_gqa(
    parameterized_running_server, parameterized_config, logger
):
    base_url, log_capture_string = parameterized_running_server

    url = f"{base_url}/activations-test"
    payload = {
        "text": TEST_PROMPT,
        "model": parameterized_config.MODEL_ID,
        "layer": parameterized_config.include_sae_patterns[0].strip("^"),
        "index": 0,  # Test with the first feature/neuron
        "secret": "secret",
    }

    logger.info(
        f"Sending request to {url} with payload: {json.dumps(payload, indent=2)}"
    )

    response = requests.post(url, json=payload)

    try:
        data = response.json()
    except json.JSONDecodeError:
        pytest.fail("Response is not valid JSON")

    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"
    assert (
        "activations" in data
    ), f"Response does not contain 'activations' key. Keys found: {', '.join(data.keys())}"

    activations = data["activations"]
    assert "dfaValues" in activations, "DFA values not found in activations"
    assert "dfaTargetIndex" in activations, "DFA target index not found in activations"
    assert "dfaMaxValue" in activations, "DFA max value not found in activations"

    logger.info("Test passed successfully")
