import requests
import time

from tests.conftest import TEST_PROMPT, TEST_SAE_MODEL_ID, TEST_SAE_ID


def test_completion_endpoint_steered(running_server, logger):
    base_url, log_capture_string = running_server

    # Function to print captured logs
    def print_logs():
        logger.info("Server Logs:")
        logger.info(log_capture_string.getvalue())
        log_capture_string.truncate(0)
        log_capture_string.seek(0)

    # Test completion endpoint
    url = f"{base_url}/completion"

    payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 21871, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["STEERED", "DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.5,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    # Perform multiple requests to get an average speed
    num_requests = 50
    total_time = 0

    for i in range(num_requests):
        start_time = time.time()
        response = requests.post(url, json=payload)
        end_time = time.time()

        assert (
            response.status_code == 200
        ), f"Expected status code 200, but got {response.status_code}"

        data = response.json()

        # Check response structure
        assert "DEFAULT" in data
        assert "STEERED" in data
        assert isinstance(data["DEFAULT"], str)
        assert isinstance(data["STEERED"], str)

        # Calculate and log response time
        response_time = end_time - start_time
        total_time += response_time
        logger.info(
            f"Request {i+1} completion time: {response_time:.4f} seconds"
        )

        # Log completions
        logger.info(f"DEFAULT completion: {data['DEFAULT']}")
        logger.info(f"STEERED completion: {data['STEERED']}")

    # Calculate and log average speed
    average_time = total_time / num_requests
    logger.info(f"Average completion speed: {average_time:.4f} seconds")
    print(
        f"Average completion speed: {average_time:.4f} seconds"
    )  # This will appear in pytest output

    # You can set a performance threshold if needed
    assert (
        average_time < 10.0
    ), f"Average response time ({average_time:.4f}s) exceeds the threshold of 10.0s"

    # Print server logs
    print_logs()


def test_completion_endpoint_errors_invalid_request_data(running_server):
    base_url, _ = running_server

    url = f"{base_url}/completion"

    # Test missing required fields
    incomplete_payload = {"prompt": TEST_PROMPT, "secret": "secret"}
    response = requests.post(url, json=incomplete_payload)
    assert response.status_code == 200
    assert response.json()["error"] == "Invalid request data"


def test_completion_endpoint_errors_invalid_secret(running_server):

    base_url, _ = running_server
    url = f"{base_url}/completion"
    # Test invalid secret
    invalid_secret_payload = {
        "prompt": TEST_PROMPT,
        "secret": "invalid_secret",
        "features": [],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.0,
        "freq_penalty": 0.0,
        "seed": 42,
    }
    response = requests.post(url, json=invalid_secret_payload)
    assert response.status_code == 200
    assert response.json()["error"] == "Forbidden"


def test_completion_endpoint_errors_unsupported_model(running_server):

    base_url, _ = running_server
    url = f"{base_url}/completion"

    # Test unsupported model
    unsupported_model_payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [],
        "model": "unsupported_model",
        "instruct": False,
        "types": ["DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.0,
        "freq_penalty": 0.0,
        "seed": 42,
    }
    response = requests.post(url, json=unsupported_model_payload)
    assert response.status_code == 200
    assert response.json()["error"] == "Unsupported model"


def test_completion_endpoint_errors_unsupported_completion_type(
    running_server,
):

    base_url, log_capture_string = running_server
    url = f"{base_url}/completion"

    # Test invalid completion type
    invalid_type_payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["INVALID_TYPE"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.0,
        "freq_penalty": 0.0,
        "seed": 42,
    }
    response = requests.post(url, json=invalid_type_payload)
    assert response.status_code == 200
    assert response.json()["error"] == "Invalid completion type: INVALID_TYPE"


def test_completion_endpoint_feature_processing(running_server):

    base_url, _ = running_server
    url = f"{base_url}/completion"

    payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [
            {"layer": TEST_SAE_ID, "index": 0, "strength": 30.0},
            {"layer": TEST_SAE_ID, "index": 1, "strength": 15.0},
            {"layer": TEST_SAE_ID, "index": 0, "strength": 20.0},
        ],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["STEERED"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.5,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    response = requests.post(url, json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "STEERED" in data
    assert isinstance(data["STEERED"], str)


def test_completion_endpoint_steered_default(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    payload = {
        "prompt": "Write a short poem about AI.",
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "types": ["STEERED", "DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 2,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    response = requests.post(url, json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "DEFAULT" in data and "STEERED" in data
    assert isinstance(data["DEFAULT"], str) and isinstance(
        data["STEERED"], str
    )
    assert data["DEFAULT"] != data["STEERED"]


def test_completion_endpoint_temperature_effect(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    payload_base = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["DEFAULT"],
        "n_completion_tokens": 5,
        "strength_multiplier": 1.0,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    # Test with low temperature
    payload_low_temp = payload_base.copy()
    payload_low_temp["temperature"] = 0.1

    # Test with high temperature
    payload_high_temp = payload_base.copy()
    payload_high_temp["temperature"] = 1.5

    response_low = requests.post(url, json=payload_low_temp)
    response_high = requests.post(url, json=payload_high_temp)

    assert response_low.status_code == 200 and response_high.status_code == 200
    data_low = response_low.json()
    data_high = response_high.json()

    assert data_low["DEFAULT"] != data_high["DEFAULT"]


def test_completion_endpoint_seed_consistency(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["STEERED", "DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.5,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    response1 = requests.post(url, json=payload)
    response2 = requests.post(url, json=payload)

    assert response1.status_code == 200 and response2.status_code == 200
    data1 = response1.json()
    data2 = response2.json()

    assert data1["DEFAULT"] == data2["DEFAULT"]
    assert data1["STEERED"] == data2["STEERED"]


def test_completion_endpoint_long_input(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    long_prompt = (
        "This is a very long prompt. " * 200
    )  # Adjust multiplier as needed to exceed TOKEN_LIMIT

    payload = {
        "prompt": long_prompt,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "instruct": False,
        "types": ["DEFAULT"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 1.0,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    response = requests.post(url, json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "error" in data
    assert "Text too long" in data["error"]


# Claude recommended this test, but it's not valid for our API. Currently we're not returning 500s.
# def test_completion_endpoint_invalid_feature(running_server):
#     base_url, _ = running_server
#     url = f"{base_url}/completion"

#     payload = {
#         "prompt": TEST_PROMPT,
#         "secret": "secret",
#         "features": [{"layer": "invalid_layer", "index": 0, "strength": 30.0}],
#         "model": TEST_SAE_MODEL_ID,
#         "instruct": False,
#         "types": ["STEERED"],
#         "n_completion_tokens": 5,
#         "temperature": 0.7,
#         "strength_multiplier": 1.5,
#         "freq_penalty": 0.0,
#         "seed": 42,
#     }

#     response = requests.post(url, json=payload)
#     assert response.status_code == 500  # Expecting a 500 Internal Server Error

#     # You may want to check for a specific error message in the response
#     # if your server provides one. For example:
#     # data = response.json()
#     # assert "error" in data
#     # assert "Invalid layer" in data["error"]

#     # Alternatively, you could log the response for debugging:
#     print(f"Response for invalid feature: {response.text}")


def test_completion_endpoint_steering_methods(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    # Base payload
    base_payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "types": ["STEERED"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 7,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    # Test simple additive steering
    simple_payload = base_payload.copy()
    simple_payload["steering_method"] = "simple_additive"
    response_simple = requests.post(url, json=simple_payload)
    
    # Test orthogonal decomposition steering
    orthogonal_payload = base_payload.copy()
    orthogonal_payload["steering_method"] = "orthogonal_decomp"
    response_orthogonal = requests.post(url, json=orthogonal_payload)

    # Test invalid steering method
    invalid_payload = base_payload.copy()
    invalid_payload["steering_method"] = "invalid_method"
    response_invalid = requests.post(url, json=invalid_payload)

    assert response_simple.status_code == 200
    assert response_orthogonal.status_code == 200
    assert response_invalid.status_code == 200
    
    # Check results
    simple_data = response_simple.json()
    orthogonal_data = response_orthogonal.json()
    invalid_data = response_invalid.json()

    assert "STEERED" in simple_data
    assert "STEERED" in orthogonal_data
    assert "error" in invalid_data
    assert invalid_data["error"] == "Invalid steering method"
    assert simple_data["STEERED"] != orthogonal_data["STEERED"]

def test_completion_endpoint_normalization(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    base_payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "features": [{"layer": TEST_SAE_ID, "index": 0, "strength": 30.0}],
        "model": TEST_SAE_MODEL_ID,
        "types": ["STEERED"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 7,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    # Test with normalization enabled
    normalized_payload = base_payload.copy()
    normalized_payload["normalize_steering"] = True
    response_normalized = requests.post(url, json=normalized_payload)

    # Test with normalization disabled
    unnormalized_payload = base_payload.copy()
    unnormalized_payload["normalize_steering"] = False
    response_unnormalized = requests.post(url, json=unnormalized_payload)

    assert response_normalized.status_code == 200
    assert response_unnormalized.status_code == 200

    normalized_data = response_normalized.json()
    unnormalized_data = response_unnormalized.json()

    assert "STEERED" in normalized_data
    assert "STEERED" in unnormalized_data
    

def test_completion_endpoint_vectors_input(running_server):
    base_url, _ = running_server
    url = f"{base_url}/completion"

    # Test with vectors instead of features
    vector_payload = {
        "prompt": TEST_PROMPT,
        "secret": "secret",
        "vectors": [{
            "strength": 30.0,
            "hook": "blocks.0.hook_resid_pre",
            "steering_vector": [0.1] * 2304  # Example vector
        }],
        "model": TEST_SAE_MODEL_ID,
        "types": ["STEERED"],
        "n_completion_tokens": 5,
        "temperature": 0.7,
        "strength_multiplier": 7,
        "freq_penalty": 0.0,
        "seed": 42,
    }

    # Test invalid vectors format
    invalid_vector_payload = vector_payload.copy()
    invalid_vector_payload["vectors"] = [{
        "strength": 30.0,
        # Missing required fields
    }]

    response_valid = requests.post(url, json=vector_payload)
    response_invalid = requests.post(url, json=invalid_vector_payload)

    assert response_valid.status_code == 200
    assert response_invalid.status_code == 200
    
    valid_data = response_valid.json()
    invalid_data = response_invalid.json()

    assert "STEERED" in valid_data
    assert "error" in invalid_data