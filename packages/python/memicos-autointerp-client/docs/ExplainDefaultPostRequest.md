# ExplainDefaultPostRequest

Request model for generating explanations of neuron/feature behavior

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activations** | [**List[NPActivation]**](NPActivation.md) | List of activation records to analyze | 
**openrouter_key** | **str** | API key for OpenRouter service | 
**model** | **str** | Model identifier to use for explanation generation | 

## Example

```python
from memicos_autointerp_client.models.explain_default_post_request import ExplainDefaultPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of ExplainDefaultPostRequest from a JSON string
explain_default_post_request_instance = ExplainDefaultPostRequest.from_json(json)
# print the JSON string representation of the object
print(ExplainDefaultPostRequest.to_json())

# convert the object into a dict
explain_default_post_request_dict = explain_default_post_request_instance.to_dict()
# create an instance of ExplainDefaultPostRequest from a dict
explain_default_post_request_from_dict = ExplainDefaultPostRequest.from_dict(explain_default_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


