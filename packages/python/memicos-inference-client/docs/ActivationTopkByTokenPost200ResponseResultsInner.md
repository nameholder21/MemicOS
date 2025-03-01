# ActivationTopkByTokenPost200ResponseResultsInner

One token's TopK result, including its top features.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token_position** | **int** | The index of the token in the prompt. | 
**token** | **str** | The token string | 
**top_features** | [**List[ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner]**](ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner.md) |  | 

## Example

```python
from memicos_inference_client.models.activation_topk_by_token_post200_response_results_inner import ActivationTopkByTokenPost200ResponseResultsInner

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationTopkByTokenPost200ResponseResultsInner from a JSON string
activation_topk_by_token_post200_response_results_inner_instance = ActivationTopkByTokenPost200ResponseResultsInner.from_json(json)
# print the JSON string representation of the object
print(ActivationTopkByTokenPost200ResponseResultsInner.to_json())

# convert the object into a dict
activation_topk_by_token_post200_response_results_inner_dict = activation_topk_by_token_post200_response_results_inner_instance.to_dict()
# create an instance of ActivationTopkByTokenPost200ResponseResultsInner from a dict
activation_topk_by_token_post200_response_results_inner_from_dict = ActivationTopkByTokenPost200ResponseResultsInner.from_dict(activation_topk_by_token_post200_response_results_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


