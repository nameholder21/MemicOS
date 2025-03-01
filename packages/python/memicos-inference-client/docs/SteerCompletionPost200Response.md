# SteerCompletionPost200Response

The steering/default responses.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**outputs** | [**List[NPSteerCompletionResponseInner]**](NPSteerCompletionResponseInner.md) |  | 

## Example

```python
from memicos_inference_client.models.steer_completion_post200_response import SteerCompletionPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of SteerCompletionPost200Response from a JSON string
steer_completion_post200_response_instance = SteerCompletionPost200Response.from_json(json)
# print the JSON string representation of the object
print(SteerCompletionPost200Response.to_json())

# convert the object into a dict
steer_completion_post200_response_dict = steer_completion_post200_response_instance.to_dict()
# create an instance of SteerCompletionPost200Response from a dict
steer_completion_post200_response_from_dict = SteerCompletionPost200Response.from_dict(steer_completion_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


