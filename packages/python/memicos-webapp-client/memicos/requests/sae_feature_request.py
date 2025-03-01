import json
from memicos.requests.base_request import (
    NPRequest,
)
from memicos.np_sae_feature import SAEFeature


class SAEFeatureRequest(NPRequest):
    def __init__(
        self,
    ):
        super().__init__("feature")

    def get(self, model_id: str, source: str, index: str) -> SAEFeature:
        result = self.send_request(method="GET", uri=f"{model_id}/{source}/{index}")

        return SAEFeature(
            modelId=result["modelId"], source=result["layer"], index=result["index"], jsonData=json.dumps(result)
        )
