# NPActivation

An activation record containing tokens and their corresponding activation values

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tokens** | **List[str]** | List of tokens for this text | 
**values** | **List[float]** | Activation values corresponding to each token | 

## Example

```python
from memicos_autointerp_client.models.np_activation import NPActivation

# TODO update the JSON string below
json = "{}"
# create an instance of NPActivation from a JSON string
np_activation_instance = NPActivation.from_json(json)
# print the JSON string representation of the object
print(NPActivation.to_json())

# convert the object into a dict
np_activation_dict = np_activation_instance.to_dict()
# create an instance of NPActivation from a dict
np_activation_from_dict = NPActivation.from_dict(np_activation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


