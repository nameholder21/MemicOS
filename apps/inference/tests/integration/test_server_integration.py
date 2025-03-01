import requests
from tests.conftest import (
    TEST_SAE_MODEL_ID,
    TEST_SET_ID,
    TEST_SAE_ID,
    TEST_PROMPT,
    BOS_TOKEN_STR,
    MODEL_DTYPE,
    SAE_DTYPE,
)


def test_running_server(running_server, logger):
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
    assert response.status_code == 200
    data = response.json()
    assert "activations" in data
    assert isinstance(data["activations"], list)


def test_activations_topk_by_token(running_server, logger):
    base_url, log_capture_string = running_server

    # Function to print captured logs
    def print_logs():
        logger.info("Server Logs:")
        logger.info(log_capture_string.getvalue())
        log_capture_string.truncate(0)
        log_capture_string.seek(0)

    # Test activations_topk_by_token endpoint
    url = f"{base_url}/activations-topk-by-token"

    payload = {
        "text": TEST_PROMPT,
        "model": TEST_SAE_MODEL_ID,
        "source_set": TEST_SET_ID,
        "layer": TEST_SAE_ID,
        "secret": "secret",
        "k": 5,  # You can adjust this value to test different k
    }

    response = requests.post(url, json=payload)
    assert (
        response.status_code == 200
    ), f"Expected status code 200, but got {response.status_code}"

    data = response.json()

    # expected_results = [
    #     {"activation_value": 2.2791714668273926, "feature_index": 9278},
    #     {"activation_value": 1.2442213296890259, "feature_index": 15033},
    #     {"activation_value": 0.6698274612426758, "feature_index": 11916},
    #     {"activation_value": 0.6674561500549316, "feature_index": 16482},
    #     {"activation_value": 0.42961758375167847, "feature_index": 20998},
    # ]

    print(data)
    assert isinstance(data["results"], list)
    assert len(data["results"]) == 5, data["results"]

    expected_tokens = [BOS_TOKEN_STR, "Hello", ",", " world", "!"]

    # check if the results are as expected
    for i, token_result in enumerate(data["results"]):
        assert token_result["position"] == i
        assert token_result["token"] == expected_tokens[i]

    # for i in range(len(expected_results)):
    #     assert (
    #         pytest.approx(
    #             token_result["top_features"][i]["activation_value"], abs=1e-2
    #         )
    #         == expected_results[i]["activation_value"]
    #     )
    #     assert (
    #         token_result["top_features"][i]["feature_index"]
    #         == expected_results[i]["feature_index"]
    #     )


# Test model and SAE dtypes
def test_model_and_sae_dtypes(model, sae_manager, config):
    # Check model dtype
    assert str(model.cfg.dtype).strip("torch.") == MODEL_DTYPE

    # Check SAE dtype
    sae = SAE_MANAGER.get_sae(TEST_SAE_ID)
    assert str(sae.W_enc.dtype).strip("torch.") == SAE_DTYPE
