# ActivationAllPost200Response

Response for NPActivationAllRequest. Contains activations for each top feature and the tokenized prompt.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activations** | [**List[ActivationAllPost200ResponseActivationsInner]**](ActivationAllPost200ResponseActivationsInner.md) |  | 
**tokens** | **List[str]** |  | 
**counts** | **List[List[float]]** | Not currently supported and may be incorrect. This is the number of features that activated by layer, starting from layer 0 of this SAE. Need to be redesigned. | [optional] 

## Example

```python
from memicos_inference_client.models.activation_all_post200_response import ActivationAllPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationAllPost200Response from a JSON string
activation_all_post200_response_instance = ActivationAllPost200Response.from_json(json)
# print the JSON string representation of the object
print(ActivationAllPost200Response.to_json())

# convert the object into a dict
activation_all_post200_response_dict = activation_all_post200_response_instance.to_dict()
# create an instance of ActivationAllPost200Response from a dict
activation_all_post200_response_from_dict = ActivationAllPost200Response.from_dict(activation_all_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


