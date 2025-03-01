# ActivationTopkByTokenPostRequest

Get activations for either a specific feature in an SAE (specified by \"source\" + \"index\") or a custom vector (specified by \"vector\" + \"hook\")

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**prompt** | **str** | Input text prompt to get activations for | 
**model** | **str** | Name of the model to test activations on | 
**source** | **str** | Source identifier - could be an SAE ID (eg 5-gemmascope-res-16k). Must be specified with \&quot;index\&quot;, or not at NPActivationAllRequest. | 
**top_k** | **int** | The number of features to include for each token position. | [optional] 
**ignore_bos** | **bool** | Whether or not to include features whose highest activation value is the BOS token. | [default to True]

## Example

```python
from memicos_inference_client.models.activation_topk_by_token_post_request import ActivationTopkByTokenPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationTopkByTokenPostRequest from a JSON string
activation_topk_by_token_post_request_instance = ActivationTopkByTokenPostRequest.from_json(json)
# print the JSON string representation of the object
print(ActivationTopkByTokenPostRequest.to_json())

# convert the object into a dict
activation_topk_by_token_post_request_dict = activation_topk_by_token_post_request_instance.to_dict()
# create an instance of ActivationTopkByTokenPostRequest from a dict
activation_topk_by_token_post_request_from_dict = ActivationTopkByTokenPostRequest.from_dict(activation_topk_by_token_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


