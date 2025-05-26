from dataclasses import dataclass
from typing import List

from memicos.np_feature import Feature


@dataclass
class Source:
    id: str
    model_id: str
    set_name: str

    def open_in_browser(self):
        import webbrowser

        webbrowser.open(f"https://memicos.org/{self.model_id}/{self.id}")

    def upload_batch(self, features: List[Feature]):
        from memicos.requests.feature_request import FeatureRequest

        request = FeatureRequest()
        return request.upload_batch(self.model_id, self.id, features)
