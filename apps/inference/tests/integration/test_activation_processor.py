import torch

from memicos_inference.endpoints.activations_all import (
    ActivationProcessor,
    ActivationRequest,
)
from tests.conftest import (
    DEVICE,
    TEST_PROMPT,
    TEST_SAE_ID,
    TEST_SET_ID,
)


def test_activation_processor(model, sae_manager, config):
    processor = ActivationProcessor(model, sae_manager, config)

    # Test input
    text = TEST_PROMPT
    device = DEVICE
    sae_id = TEST_SAE_ID
    hook_name = SAE_MANAGER.get_sae_hook(sae_id)
    prepend_bos = SAE_MANAGER.get_sae(sae_id).cfg.prepend_bos

    # Direct model calculation
    tokens = model.to_tokens(text, prepend_bos=prepend_bos, truncate=False)[0]
    str_tokens = model.to_str_tokens(
        text,
        prepend_bos=prepend_bos,
    )
    _, direct_cache = model.run_with_cache(tokens)

    direct_activation_data = direct_cache[hook_name].to(device)

    # ActivationProcessor calculation
    req = ActivationRequest(
        text=text,
        selected_layers=[sae_id],
        sort_indexes=[],
        source_set=TEST_SET_ID,
        num_results=10,
        ignore_bos=True,
    )

    tokens, str_tokens_processor, processor_cache = processor._tokenize_and_get_cache(
        req.text, prepend_bos
    )
    processor_activation_data = processor_cache[hook_name].to(device)

    # Compare cache activations
    assert torch.allclose(
        direct_activation_data, processor_activation_data, atol=1e-5
    ), "Mismatch in cache activations between direct calculation and ActivationProcessor"

    # Compare tokens
    assert (
        str_tokens == str_tokens_processor
    ), "Token mismatch between direct calculation and ActivationProcessor"

    # Process layers using ActivationProcessor
    layer_activations = processor._process_layers(req, tokens, processor_cache)

    # Verify layer_activations structure
    assert (
        len(layer_activations) == 1
    ), f"Expected 1 layer, got {len(layer_activations)}"
    layer_activation = layer_activations[0]
    assert (
        "activations" in layer_activation
    ), "Missing 'activations' in layer_activations"

    # Compare activations
    sae = SAE_MANAGER.get_sae(sae_id)
    direct_feature_activation_data = sae.encode(direct_activation_data)
    direct_act_data = torch.transpose(direct_feature_activation_data.squeeze(0), 0, 1)
    processor_act_data = layer_activation["activations"]

    assert torch.allclose(
        direct_act_data, processor_act_data, atol=1e-5
    ), "Mismatch in encoded activations between direct calculation and ActivationProcessor"


def test_sae_activations(model, sae_manager, config):
    processor = ActivationProcessor(model, sae_manager, config)

    # Test input
    text = TEST_PROMPT
    device = DEVICE
    sae_id = TEST_SAE_ID
    hook_name = SAE_MANAGER.get_sae_hook(sae_id)
    prepend_bos = SAE_MANAGER.get_sae(sae_id).cfg.prepend_bos

    # Direct calculation
    tokens = model.to_tokens(text, prepend_bos=prepend_bos, truncate=False)[0]
    _, direct_cache = model.run_with_cache(tokens)

    direct_activation_data = direct_cache[hook_name].to(device)

    sae = SAE_MANAGER.get_sae(sae_id)
    direct_feature_activation_data = sae.encode(direct_activation_data)
    direct_act_data = torch.transpose(direct_feature_activation_data.squeeze(0), 0, 1)

    # ActivationProcessor calculation
    req = ActivationRequest(
        text=text,
        selected_layers=[sae_id],
        sort_indexes=[],
        source_set=TEST_SET_ID,
        num_results=10,
        ignore_bos=True,
    )

    tokens, str_tokens_processor, processor_cache = processor._tokenize_and_get_cache(
        req.text, prepend_bos
    )
    # processor_activation_data = processor_cache[hook_name].to(device)

    # Process layers using ActivationProcessor
    layer_activations = processor._process_layers(req, tokens, processor_cache)

    # Get the processed activations from the ActivationProcessor
    processor_act_data = layer_activations[0]["activations"]

    # Compare SAE activations
    assert torch.allclose(
        direct_act_data, processor_act_data, atol=1e-5
    ), "Mismatch in SAE activations between direct calculation and ActivationProcessor"

    # Compare shapes
    assert (
        direct_act_data.shape == processor_act_data.shape
    ), f"Shape mismatch: direct {direct_act_data.shape}, processor {processor_act_data.shape}"

    # Compare a few specific values
    num_samples = 5
    for i in range(num_samples):
        row = torch.randint(0, direct_act_data.shape[0], (1,)).item()
        col = torch.randint(0, direct_act_data.shape[1], (1,)).item()
        assert torch.allclose(
            direct_act_data[row, col], processor_act_data[row, col], atol=1e-5
        ), f"Mismatch at position ({row}, {col}): direct {direct_act_data[row, col]}, processor {processor_act_data[row, col]}"

    # Optional: Return values for further inspection if needed
    return direct_act_data, processor_act_data
