# ExplainDefaultPost200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**explanation** | **str** | The generated explanation for the given set of activations | 

## Example

```python
from memicos_autointerp_client.models.explain_default_post200_response import ExplainDefaultPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ExplainDefaultPost200Response from a JSON string
explain_default_post200_response_instance = ExplainDefaultPost200Response.from_json(json)
# print the JSON string representation of the object
print(ExplainDefaultPost200Response.to_json())

# convert the object into a dict
explain_default_post200_response_dict = explain_default_post200_response_instance.to_dict()
# create an instance of ExplainDefaultPost200Response from a dict
explain_default_post200_response_from_dict = ExplainDefaultPost200Response.from_dict(explain_default_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


