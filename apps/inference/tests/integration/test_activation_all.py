from fastapi.testclient import TestClient
from memicos_inference_client.models.activation_all_post_request import (
    ActivationAllPostRequest,
)

from memicos_inference.server import app

client = TestClient(app)


def test_activation_all(initialize_models: None):  # noqa: ARG001
    """
    Test basic functionality of the /activation/all endpoint with a simple request.
    """
    request = ActivationAllPostRequest(
        prompt="Hello, world!",
        model="gpt2-small",
        source_set="res-jb",
        selected_sources=["7-res-jb"],
        sort_by_token_indexes=[],
        ignore_bos=True,
    )

    response = client.post(
        "/v1/activation/all",
        json=request.model_dump(),
        headers={"X-SECRET-KEY": "cat"},
    )
    assert response.status_code == 200

    data = response.json()
    assert "activations" in data
    assert "tokens" in data
    assert len(data["tokens"]) > 0
    assert len(data["activations"]) > 0

    # Check activation structure
    activation = data["activations"][0]
    assert "source" in activation
    assert "index" in activation
    assert "values" in activation
    assert "max_value" in activation
    assert "max_value_index" in activation
