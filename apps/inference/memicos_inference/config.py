import json
import logging
import re
from typing import Optional

import pandas as pd
from sae_lens.toolkit.pretrained_saes_directory import (
    get_pretrained_saes_directory,
)

logger = logging.getLogger(__name__)


class Config:
    _instance = None  # Class variable to store the singleton instance

    @classmethod
    def get_instance(cls):
        """Get the global Config instance, creating it if it doesn't exist"""
        if cls._instance is None:
            cls._instance = Config()
        return cls._instance

    def __init__(
        self,
        model_id="gpt2-small",
        custom_hf_model_id=None,
        sae_sets: list[str] = ["res-jb"],
        model_dtype="float32",
        sae_dtype="float32",
        secret: Optional[str] = None,
        port=5000,
        token_limit=100,
        saes_path=None,
        valid_completion_types=["default", "steered"],
        num_layers=None,
        device=None,
        override_model_id=None,
        include_sae=None,
        exclude_sae=None,
        model_from_pretrained_kwargs="{}",
        max_loaded_saes=100,
        steer_special_token_ids=None,
        nnsight=False,
    ):
        self.MODEL_ID = model_id
        self.CUSTOM_HF_MODEL_ID = custom_hf_model_id
        self.OVERRIDE_MODEL_ID = override_model_id or model_id
        self.MODEL_DTYPE = model_dtype
        self.SAE_DTYPE = sae_dtype
        self.SECRET = secret
        self.PORT = port
        self.TOKEN_LIMIT = token_limit
        self.SAES_PATH = saes_path
        self.VALID_COMPLETION_TYPES = valid_completion_types
        self.NUM_LAYERS = num_layers
        self.DEVICE = device
        self.SAE_SETS = sae_sets
        self.include_sae_patterns = include_sae
        self.exclude_sae_patterns = exclude_sae
        self.SAE_CONFIG = self._filter_sae_config(self._generate_sae_config())
        self.MODEL_KWARGS = json.loads(model_from_pretrained_kwargs)
        self.MAX_LOADED_SAES = max_loaded_saes
        self.STEER_SPECIAL_TOKEN_IDS = steer_special_token_ids
        self.NNSIGHT = nnsight

        # Log configuration details after initialization
        logger.info(
            f"Initialized Config with:\n"
            f"  MODEL_ID: {self.MODEL_ID}\n"
            f"  CUSTOM_HF_MODEL_ID: {self.CUSTOM_HF_MODEL_ID}\n"
            f"  OVERRIDE_MODEL_ID: {self.OVERRIDE_MODEL_ID}\n"
            f"  MODEL_DTYPE: {self.MODEL_DTYPE}\n"
            f"  SAE_DTYPE: {self.SAE_DTYPE}\n"
            f"  PORT: {self.PORT}\n"
            f"  TOKEN_LIMIT: {self.TOKEN_LIMIT}\n"
            f"  DEVICE: {self.DEVICE}\n"
            f"  SAE_SETS: {self.SAE_SETS}\n"
            f"  MAX_LOADED_SAES: {self.MAX_LOADED_SAES}\n"
            f"  INCLUDE_SAE_PATTERNS: {self.include_sae_patterns}\n"
            f"  EXCLUDE_SAE_PATTERNS: {self.exclude_sae_patterns}\n"
            f"  NNSIGHT: {self.NNSIGHT}\n"
        )

    def set_num_layers(self, num_layers):
        self.NUM_LAYERS = num_layers

    def set_steer_special_token_ids(self, steer_special_token_ids):
        self.STEER_SPECIAL_TOKEN_IDS = steer_special_token_ids

    def are_models_compatible(self, model_id_1, model_id_2):
        if model_id_1.endswith("-it"):
            model_id_1 = model_id_1[:-3]
        elif model_id_2.endswith("-it"):
            model_id_2 = model_id_2[:-3]
        return model_id_1 == model_id_2

    def get_valid_model_ids(self):
        return set([sae_set["model"] for sae_set in self.SAE_CONFIG])

    def _generate_sae_config(self):
        directory_df = get_saelens_memicos_directory_df()
        config_json = config_to_json(
            directory_df,
            selected_sets_memicos=self.SAE_SETS,
            selected_model=(
                self.CUSTOM_HF_MODEL_ID if self.CUSTOM_HF_MODEL_ID else self.MODEL_ID
            ),
        )
        return config_json  # noqa: RET504

    def _filter_sae_config(self, sae_config):
        filtered_config = []
        for sae_set in sae_config:
            filtered_saes = self._filter_saes(sae_set["saes"])
            if filtered_saes:
                sae_set = sae_set.copy()
                sae_set["saes"] = filtered_saes
                filtered_config.append(sae_set)
        return filtered_config

    def _filter_saes(self, sae_ids):
        return [
            sae_id
            for sae_id in sae_ids
            if self._match_patterns(
                sae_id, self.include_sae_patterns, self.exclude_sae_patterns
            )
        ]

    def _match_patterns(self, sae_id, include_patterns, exclude_patterns):
        if include_patterns and not any(
            re.search(pattern, sae_id) for pattern in include_patterns
        ):
            return False
        if exclude_patterns:
            return not any(re.search(pattern, sae_id) for pattern in exclude_patterns)
        return True


# this is an example of a Claude refactor gone wrong. way too confusing.
def get_saelens_memicos_directory_df():
    df = pd.DataFrame.from_records(
        {k: v.__dict__ for k, v in get_pretrained_saes_directory().items()}
    ).T
    df.drop(
        columns=[
            "repo_id",
            "saes_map",
            "expected_var_explained",
            "expected_l0",
            "config_overrides",
            "conversion_func",
        ],
        inplace=True,
    )
    df["memicos_id_list"] = df["memicos_id"].apply(lambda x: list(x.items()))
    df_exploded = df.explode("memicos_id_list")
    df_exploded[["sae_lens_id", "memicos_id"]] = pd.DataFrame(
        df_exploded["memicos_id_list"].tolist(), index=df_exploded.index
    )
    df_exploded = df_exploded.drop(columns=["memicos_id_list"])
    df_exploded = df_exploded.reset_index(drop=True)
    df_exploded["memicos_set"] = df_exploded["memicos_id"].apply(
        lambda x: ("-".join(x.split("/")[-1].split("-")[1:]) if x is not None else None)
    )
    return df_exploded


def config_to_json(
    directory_df: pd.DataFrame,
    selected_sets_sae_lens: Optional[list[str]] = None,
    selected_sets_memicos: Optional[list[str]] = None,
    selected_model: Optional[str] = None,
) -> str:
    if selected_model:
        directory_df = directory_df[directory_df["model"] == selected_model]
    if selected_sets_memicos and selected_sets_sae_lens:
        directory_df = directory_df[
            (directory_df["memicos_set"].isin(selected_sets_memicos))
            | (directory_df["release"].isin(selected_sets_sae_lens))
        ]
    elif selected_sets_sae_lens:
        directory_df = directory_df[
            directory_df["release"].isin(selected_sets_sae_lens)
        ]
    elif selected_sets_memicos:
        directory_df = directory_df[
            (directory_df["memicos_set"].isin(selected_sets_memicos))
        ]
    grouped = directory_df.groupby("model")
    sets_to_include = directory_df.memicos_set.unique()
    config_json = []
    for model, group in grouped:
        sets_to_include = directory_df.memicos_set.unique()
        for set_name in sets_to_include:
            set_data = group[group["memicos_set"] == set_name]
            set_entry = {
                "model": model,
                "set": set_name,
                "type": "saelens-1",
                "local": False,
                "saes": [
                    sae.split("/")[-1] for sae in set_data["memicos_id"].values
                ],
            }
            config_json.append(set_entry)
    return config_json


def get_sae_lens_ids_from_memicos_id(model_id, memicos_id, df_exploded):
    # find where memicos_id ends in /memicos_id and df_exploded["model"] = model_id
    tmp_df = df_exploded[
        (df_exploded["model"] == model_id)
        & (df_exploded["memicos_id"].str.endswith(f"/{memicos_id}"))
    ]
    assert (
        tmp_df.shape[0] == 1
    ), f"Found {tmp_df.shape[0]} entries when searching for {model_id}/{memicos_id}"
    sae_lens_release = tmp_df.release.values[0]
    sae_lens_id = tmp_df.sae_lens_id.values[0]
    return sae_lens_release, sae_lens_id
