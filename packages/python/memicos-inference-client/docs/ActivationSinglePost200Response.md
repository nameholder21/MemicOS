# ActivationSinglePost200Response

Response for NPActivationSingleRequest. Contains the activation values and tokenized prompt.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activation** | [**ActivationSinglePost200ResponseActivation**](ActivationSinglePost200ResponseActivation.md) |  | 
**tokens** | **List[str]** |  | 

## Example

```python
from memicos_inference_client.models.activation_single_post200_response import ActivationSinglePost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationSinglePost200Response from a JSON string
activation_single_post200_response_instance = ActivationSinglePost200Response.from_json(json)
# print the JSON string representation of the object
print(ActivationSinglePost200Response.to_json())

# convert the object into a dict
activation_single_post200_response_dict = activation_single_post200_response_instance.to_dict()
# create an instance of ActivationSinglePost200Response from a dict
activation_single_post200_response_from_dict = ActivationSinglePost200Response.from_dict(activation_single_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


