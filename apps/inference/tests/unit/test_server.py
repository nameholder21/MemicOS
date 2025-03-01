from unittest.mock import patch
from memicos_inference.server import parse_env_and_args


def test_multiple_sae_sets():
    test_args = [
        "script_name",
        "--model_id",
        "gpt2-small",
        "--sae_sets",
        "res-jb",
        "att-kk",
    ]
    with patch("sys.argv", test_args):
        parsed_args = parse_env_and_args()
    assert parsed_args.sae_sets == ["res-jb", "att-kk"]
