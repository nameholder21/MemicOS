import torch

from memicos_inference.sae_manager import SAEManager
from memicos_inference.shared import Model


def test_initialize(initialize_models: None):  # noqa: ARG001
    """
    Test that the model and SAE are properly initialized when using the /initialize endpoint.
    """
    # Check that the model is loaded
    model = Model.get_instance()
    assert model is not None

    # Check that the SAE is loaded
    sae_manager = SAEManager.get_instance()
    assert sae_manager is not None
    assert "7-res-jb" in sae_manager.sae_data
    sae = sae_manager.sae_data["7-res-jb"]["sae"]
    assert sae is not None

    # Test a simple forward pass
    input_text = "Hello, world!"
    tokens = model.to_tokens(input_text)
    with torch.no_grad():
        logits = model(tokens)
    assert logits is not None
    assert logits.shape[0] == 1  # batch size of 1
    assert logits.shape[1] == len(tokens[0])  # sequence length
    assert logits.shape[2] == model.cfg.d_vocab  # vocabulary size
