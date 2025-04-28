from memicos_inference_client.models.activation_all_post200_response import (
    ActivationAllPost200Response,
)
from memicos_inference_client.models.activation_all_post_request import (
    ActivationAllPostRequest,
)


def test_activation_all(client, initialize_models):  # noqa: ARG001
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
    assert isinstance(data["tokens"], list)
    assert isinstance(data["activations"], list)
    assert len(data["tokens"]) > 0
    assert len(data["activations"]) > 0

    ActivationAllPost200Response(**data)
