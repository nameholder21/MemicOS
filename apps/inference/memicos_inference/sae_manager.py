from pathlib import Path
from huggingface_hub import snapshot_download
from memicos_inference.saes.saelens import SaeLensSAE
from memicos_inference.config import (
    get_saelens_memicos_directory_df,
    get_sae_lens_ids_from_memicos_id,
)
import logging
from collections import OrderedDict
import time
from memicos_inference.config import Config

logger = logging.getLogger(__name__)

# TODO: this should be in SAELens
# if we find this in the memicos ID, we enable DFA
DFA_ENABLED_NP_ID_SEGMENT = "-att-"
DFA_ENABLED_NP_ID_SEGMENT_ALT = "-att_"


class SAE_TYPE:
    NEURONS = "neurons"
    SAELENS = "saelens-1"


def get_layer_num_from_sae_id(sae_id: str) -> int:
    if sae_id.isdigit():
        return int(sae_id)
    else:
        return int(sae_id.split("-")[0])


class SAEManager:
    NEURONS_SOURCESET = "neurons"

    _instance = None  # Class variable to store the singleton instance

    @classmethod
    def get_instance(cls):
        """Get the global SAEManager instance, creating it if it doesn't exist"""
        if cls._instance is None:
            cls._instance = SAEManager()
        return cls._instance

    def __init__(
        self,
        num_layers: int = 0,
        device: str = "cuda",
    ):
        self.config = Config.get_instance()
        self.num_layers = num_layers
        self.device = device
        self.max_loaded_saes = self.config.MAX_LOADED_SAES

        self.sae_data = {}  # New consolidated dictionary
        self.sae_set_to_saes = {}
        self.valid_sae_sets = []
        self.loaded_saes = OrderedDict()  # Keep track of loaded SAEs
        # self.load_saes()

    def load_saes(self):
        server_cfg = Config.get_instance().SAE_CONFIG

        self.setup_neuron_layers()

        all_sae_ids = []
        for sae_set in server_cfg:
            logger.info(f"Processing SAE set: {sae_set['set']}")
            self.valid_sae_sets.append(sae_set["set"])
            all_sae_ids.extend(sae_set["saes"])
            self.sae_set_to_saes[sae_set["set"]] = sae_set["saes"]

        starting_saes = self.get_starting_saes(all_sae_ids)

        # Load and immediately unload all SAEs not in starting_saes
        for sae_id in all_sae_ids:
            if sae_id not in starting_saes:
                self.load_sae(
                    (
                        self.config.CUSTOM_HF_MODEL_ID
                        if self.config.CUSTOM_HF_MODEL_ID
                        else self.config.MODEL_ID
                    ),
                    sae_id,
                )
                self.unload_sae(sae_id)

        # Load starting SAEs
        for sae_id in starting_saes:
            self.load_sae(
                (
                    self.config.CUSTOM_HF_MODEL_ID
                    if self.config.CUSTOM_HF_MODEL_ID
                    else self.config.MODEL_ID
                ),
                sae_id,
            )

        logger.info(f"Loaded {len(self.loaded_saes)} SAEs")

        self.print_sae_status()

    def get_starting_saes(self, all_sae_ids):
        return all_sae_ids[: (self.max_loaded_saes)]

    def load_sae(self, model_id, sae_id):
        start_time = time.time()
        logger.info(f"Loading SAE: {sae_id}")

        sae_lens_release, sae_lens_id = get_sae_lens_ids_from_memicos_id(
            model_id=model_id,
            memicos_id=sae_id,
            df_exploded=get_saelens_memicos_directory_df(),
        )

        loaded_sae, hook_name = SaeLensSAE.load(
            release=sae_lens_release,
            sae_id=sae_lens_id,
            device=self.device,
            dtype=self.config.SAE_DTYPE,
        )

        self.sae_data[sae_id] = {
            "sae": loaded_sae,
            "hook": hook_name,
            "memicos_id": loaded_sae.cfg.memicos_id,
            "type": SAE_TYPE.SAELENS,
            # TODO: this should be in SAELens
            "dfa_enabled": DFA_ENABLED_NP_ID_SEGMENT in loaded_sae.cfg.memicos_id
            or DFA_ENABLED_NP_ID_SEGMENT_ALT in loaded_sae.cfg.memicos_id,
            "transcoder": False,  # You might want to set this based on some condition
        }

        self.loaded_saes[sae_id] = None  # We're using OrderedDict as an OrderedSet
        if len(self.loaded_saes) > self.max_loaded_saes:
            lru_sae = next(iter(self.loaded_saes))
            self.unload_sae(lru_sae)

        end_time = time.time()

        logger.info(
            f"Successfully loaded SAE: {sae_id} in {end_time - start_time:.2f} seconds"
        )

    def unload_sae(self, sae_id):
        start_time = time.time()
        logger.info(f"Starting to unload SAE: {sae_id}")

        if sae_id in self.sae_data:
            self.sae_data[sae_id]["sae"] = None

        if sae_id in self.loaded_saes:
            del self.loaded_saes[sae_id]

        end_time = time.time()
        logger.info(
            f"Successfully unloaded SAE: {sae_id} in {end_time - start_time:.2f} seconds"
        )

    def get_sae(self, source):
        if source not in self.loaded_saes:
            self.load_sae(
                (
                    self.config.CUSTOM_HF_MODEL_ID
                    if self.config.CUSTOM_HF_MODEL_ID
                    else self.config.MODEL_ID
                ),
                source,
            )
        else:
            self.loaded_saes.move_to_end(source)
        return self.sae_data.get(source, {}).get("sae")

    def setup_neuron_layers(self):
        neurons_sourceset = []
        for layer in range(self.num_layers):
            layer_str = str(layer)
            neurons_sourceset.append(layer_str)
            self.sae_data[layer_str] = {
                "sae": None,
                "memicos_id": None,
                "dfa_enabled": False,
                "transcoder": False,
                "type": SAE_TYPE.NEURONS,
                "hook": f"blocks.{layer_str}.mlp.hook_post",
            }

        self.sae_set_to_saes[self.NEURONS_SOURCESET] = neurons_sourceset
        return neurons_sourceset

    def download_sae_set(self, sae_set):
        sae_set_id = sae_set["set"]
        sae_set_dir = f"{self.config.MODEL_ID}__{sae_set_id}"
        sae_set_path = Path(self.config.SAES_PATH).joinpath(sae_set_dir)

        if (
            not sae_set["local"] and sae_set["type"] != "saelens-1"
        ):  # SAE Lens one will download prior to loading.
            snapshot_download(
                repo_id=f"{self.config.HUGGINGFACE_ACCOUNT}/{sae_set_dir}",
                local_dir=str(sae_set_path),
            )

        return sae_set_path

    def get_supported_memicos_ids(self):
        """
        Get a list of all MemicOS IDs supported by the manager.

        Returns:
            list: A list of all supported MemicOS IDs.
        """
        memicos_ids = []
        for data in self.sae_data.values():
            memicos_id = data.get("memicos_id")
            if memicos_id is not None:
                memicos_ids.append(memicos_id)
        return memicos_ids

    def get_sae_id_by_memicos_id(self, memicos_id):
        """
        Retrieve the SAE ID corresponding to a given MemicOS ID.

        Args:
            memicos_id (str): The MemicOS ID to search for.

        Returns:
            str or None: The corresponding SAE ID if found, None otherwise.
        """
        for sae_id, data in self.sae_data.items():
            if data.get("memicos_id") == memicos_id:
                return sae_id
        return None

    def print_sae_status(self):
        """
        Print a nicely formatted status of loadable and loaded SAEs.
        """
        print("\nSAE Status:")
        print("===========")

        print("\nLoadable SAEs:")
        for sae_set, sae_ids in self.sae_set_to_saes.items():
            if sae_set == self.NEURONS_SOURCESET:
                continue
            print(f"  {sae_set}:")
            for sae_id in sae_ids:
                status = "Loaded" if sae_id in self.loaded_saes else "Not Loaded"
                print(f"    - {sae_id}: {status}")

        print("\nCurrently Loaded SAEs:")
        for i, sae_id in enumerate(self.loaded_saes, 1):
            print(f"  {i}. {sae_id}")

        print(f"\nTotal Loaded: {len(self.loaded_saes)} / {self.max_loaded_saes}")

    # Utility methods
    def get_sae_type(self, sae_id):
        return self.sae_data.get(sae_id, {}).get("type")

    def get_sae_hook(self, sae_id):
        return self.sae_data.get(sae_id, {}).get("hook")

    def is_dfa_enabled(self, sae_id):
        return self.sae_data.get(sae_id, {}).get("dfa_enabled", False)

    def get_valid_sae_sets(self):
        return self.valid_sae_sets
