# ActivationSinglePost200ResponseActivation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**values** | **List[float]** |  | 
**max_value** | **float** |  | 
**max_value_index** | **int** |  | 
**dfa_values** | **List[float]** |  | [optional] 
**dfa_max_value** | **float** |  | [optional] 
**dfa_target_index** | **int** |  | [optional] 

## Example

```python
from memicos_inference_client.models.activation_single_post200_response_activation import ActivationSinglePost200ResponseActivation

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationSinglePost200ResponseActivation from a JSON string
activation_single_post200_response_activation_instance = ActivationSinglePost200ResponseActivation.from_json(json)
# print the JSON string representation of the object
print(ActivationSinglePost200ResponseActivation.to_json())

# convert the object into a dict
activation_single_post200_response_activation_dict = activation_single_post200_response_activation_instance.to_dict()
# create an instance of ActivationSinglePost200ResponseActivation from a dict
activation_single_post200_response_activation_from_dict = ActivationSinglePost200ResponseActivation.from_dict(activation_single_post200_response_activation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


