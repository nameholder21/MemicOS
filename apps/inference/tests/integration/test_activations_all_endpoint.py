import json
from collections import Counter

import pytest
import requests

from tests.conftest import (
    BOS_TOKEN_STR,
    TEST_PROMPT,
    TEST_SAE_ID,
    TEST_SAE_MODEL_ID,
    TEST_SET_ID,
)

DFA_TEST_PROMPT = "The quick brown fox jumps over the lazy dog."


def test_activations_all_endpoint(running_server, logger):
    base_url, log_capture_string = running_server

    # Function to print captured logs
    def print_logs():
        logger.info("Server Logs:")
        logger.info(log_capture_string.getvalue())
        log_capture_string.truncate(0)
        log_capture_string.seek(0)

    # Test activations_all endpoint
    url = f"{base_url}/activations-all"

    payload = {
        "text": TEST_PROMPT,
        "model": TEST_SAE_MODEL_ID,
        "source_set": TEST_SET_ID,
        "selected_layers": [TEST_SAE_ID],
        "secret": "secret",
        "sort_indexes": [],
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
    assert isinstance(data["activations"], list), "'activations' is not a list"
    assert "tokens" in data, "Response does not contain 'tokens' key"
    assert "counts" in data, "Response does not contain 'counts' key"

    # Check for duplicate indices
    indices = [activation["index"] for activation in data["activations"]]
    index_counts = Counter(indices)
    duplicate_indices = [index for index, count in index_counts.items() if count > 1]

    assert len(duplicate_indices) == 0, f"Found duplicate indices: {duplicate_indices}"

    # Additional checks for the structure of each activation
    for activation in data["activations"]:
        assert "index" in activation, "Activation missing 'index'"
        assert "layer" in activation, "Activation missing 'layer'"
        assert "maxValue" in activation, "Activation missing 'maxValue'"
        assert "maxValueIndex" in activation, "Activation missing 'maxValueIndex'"
        assert "sumValues" in activation, "Activation missing 'sumValues'"
        assert "values" in activation, "Activation missing 'values'"
        assert isinstance(activation["values"], list), "'values' is not a list"

    # Check tokens
    assert len(data["tokens"]) > 0, "No tokens returned"
    assert data["tokens"][0] == BOS_TOKEN_STR, f"First token is not '{BOS_TOKEN_STR}'"
    assert data["tokens"][1] == "Hello", "Second token is not 'Hello'"

    # Check counts
    assert len(data["counts"]) == 2, "Expected 2 layers in 'counts'"
    assert all(
        isinstance(count, list) and len(count) == 5 for count in data["counts"]
    ), "Invalid structure in 'counts'"

    logger.info("Test passed successfully")


def test_activations_all_endpoint_with_feature_filter(running_server, logger):
    base_url, log_capture_string = running_server
    url = f"{base_url}/activations-all"

    payload = {
        "text": TEST_PROMPT,
        "model": TEST_SAE_MODEL_ID,
        "source_set": TEST_SET_ID,
        "selected_layers": [TEST_SAE_ID],
        "secret": "secret",
        "sort_indexes": [],
        "feature_filter": [9038, 13338],  # Filter for first 5 features
    }

    response = requests.post(url, json=payload)
    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"

    data = response.json()
    assert "activations" in data, "Response does not contain 'activations' key"
    assert (
        len(data["activations"]) == 2
    ), f"Expected 2 activations, but got {len(data['activations'])}"

    for activation in data["activations"]:
        assert (
            activation["index"] in payload["feature_filter"]
        ), f"Activation index {activation['index']} not in feature filter"

    logger.info("Test with feature filter passed successfully")


def test_top_k_by_decoder_cosine_similarity(running_server, logger):
    base_url, log_capture_string = running_server
    url = f"{base_url}/top-k-by-decoder-cosine-similarity"

    payload = {
        "sae_id": TEST_SAE_ID,
        "feature_id": 0,
        "model": TEST_SAE_MODEL_ID,
        "secret": "secret",
        "k": 5,
    }

    response = requests.post(url, json=payload)
    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"

    data = response.json()
    assert "feature_id" in data, "Response does not contain 'feature_id' key"
    assert "top_k_features" in data, "Response does not contain 'top_k_features' key"
    assert isinstance(data["top_k_features"], list), "'top_k_features' is not a list"
    assert len(data["top_k_features"]) == 5, "Expected 5 top features"

    for feature in data["top_k_features"]:
        assert "index" in feature, "Feature missing 'index'"
        assert "cosine_similarity" in feature, "Feature missing 'cosine_similarity'"
        assert isinstance(feature["index"], int), "'index' is not an integer"
        assert isinstance(
            feature["cosine_similarity"], float
        ), "'cosine_similarity' is not a float"
        assert (
            0 <= feature["cosine_similarity"] <= 1
        ), "Cosine similarity should be between 0 and 1"

    # Check if the features are sorted by cosine similarity in descending order
    cosine_similarities = [
        feature["cosine_similarity"] for feature in data["top_k_features"]
    ]
    assert cosine_similarities == sorted(
        cosine_similarities, reverse=True
    ), "Features are not sorted by cosine similarity"

    expected_indices = [0, 15088, 15820, 154, 9420]
    expected_values = [
        1.0000001192092896,
        0.11775779724121094,
        0.09122851490974426,
        0.08030861616134644,
        0.0798678770661354,
    ]
    found_indices = [feature["index"] for feature in data["top_k_features"]]
    found_values = [feature["cosine_similarity"] for feature in data["top_k_features"]]
    assert (
        found_indices == expected_indices
    ), f"Indices do not match expected values, found {found_indices}"
    assert all(
        abs(a - b) < 1e-6 for a, b in zip(found_values, expected_values)
    ), f"Values do not match expected values, found {found_values}"

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
def test_ordinary_dfa(parameterized_running_server, parameterized_config, logger):
    base_url, log_capture_string = parameterized_running_server

    url = f"{base_url}/activations-all"
    payload = {
        "text": DFA_TEST_PROMPT,
        "model": parameterized_config.MODEL_ID,
        "source_set": parameterized_config.SAE_SETS[0],
        "selected_layers": [parameterized_config.include_sae_patterns[0].strip("^")],
        "secret": "secret",
        "sort_indexes": [],
        "num_results": 5,  # Limit to top 5 activations for brevity
    }

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

    for activation in data["activations"]:
        if "dfaValues" not in activation:
            logger.warning(
                f"No DFA values found for feature index {activation['index']}"
            )

    assert any(
        "dfaValues" in activation for activation in data["activations"]
    ), "No DFA values found in any activation"


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
def test_gqa_dfa(parameterized_running_server, parameterized_config, logger):
    base_url, log_capture_string = parameterized_running_server

    url = f"{base_url}/activations-all"
    payload = {
        "text": DFA_TEST_PROMPT,
        "model": parameterized_config.MODEL_ID,
        "source_set": parameterized_config.SAE_SETS[0],
        "selected_layers": [parameterized_config.include_sae_patterns[0].strip("^")],
        "secret": "secret",
        "sort_indexes": [],
        "num_results": 5,  # Limit to top 5 activations for brevity
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

    for activation in data["activations"]:
        if "dfaValues" not in activation:
            logger.warning(
                f"No DFA values found for feature index {activation['index']}"
            )

    assert any(
        "dfaValues" in activation for activation in data["activations"]
    ), "No DFA values found in any activation"
