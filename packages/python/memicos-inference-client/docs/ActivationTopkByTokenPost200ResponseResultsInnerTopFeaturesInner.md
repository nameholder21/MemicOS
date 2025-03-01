# ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**feature_index** | **int** | The index of the feature in the SAE. | 
**activation_value** | **float** | The activation value of this feature at this token position. | 

## Example

```python
from memicos_inference_client.models.activation_topk_by_token_post200_response_results_inner_top_features_inner import ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner from a JSON string
activation_topk_by_token_post200_response_results_inner_top_features_inner_instance = ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner.from_json(json)
# print the JSON string representation of the object
print(ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner.to_json())

# convert the object into a dict
activation_topk_by_token_post200_response_results_inner_top_features_inner_dict = activation_topk_by_token_post200_response_results_inner_top_features_inner_instance.to_dict()
# create an instance of ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner from a dict
activation_topk_by_token_post200_response_results_inner_top_features_inner_from_dict = ActivationTopkByTokenPost200ResponseResultsInnerTopFeaturesInner.from_dict(activation_topk_by_token_post200_response_results_inner_top_features_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


