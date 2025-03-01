# ActivationTopkByTokenPost200Response

Response for NPActivationTopkByTokenRequest.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**results** | [**List[ActivationTopkByTokenPost200ResponseResultsInner]**](ActivationTopkByTokenPost200ResponseResultsInner.md) |  | 
**tokens** | **List[str]** |  | 

## Example

```python
from memicos_inference_client.models.activation_topk_by_token_post200_response import ActivationTopkByTokenPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationTopkByTokenPost200Response from a JSON string
activation_topk_by_token_post200_response_instance = ActivationTopkByTokenPost200Response.from_json(json)
# print the JSON string representation of the object
print(ActivationTopkByTokenPost200Response.to_json())

# convert the object into a dict
activation_topk_by_token_post200_response_dict = activation_topk_by_token_post200_response_instance.to_dict()
# create an instance of ActivationTopkByTokenPost200Response from a dict
activation_topk_by_token_post200_response_from_dict = ActivationTopkByTokenPost200Response.from_dict(activation_topk_by_token_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


