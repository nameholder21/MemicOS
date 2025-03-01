# ActivationAllPost200ResponseActivationsInner

One feature and its activation in an NPActivationAllResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**source** | **str** |  | 
**index** | **int** |  | 
**values** | **List[float]** |  | 
**sum_values** | **float** |  | [optional] 
**max_value** | **float** |  | 
**max_value_index** | **float** |  | 
**dfa_values** | **List[float]** |  | [optional] 
**dfa_target_index** | **int** |  | [optional] 
**dfa_max_value** | **float** |  | [optional] 

## Example

```python
from memicos_inference_client.models.activation_all_post200_response_activations_inner import ActivationAllPost200ResponseActivationsInner

# TODO update the JSON string below
json = "{}"
# create an instance of ActivationAllPost200ResponseActivationsInner from a JSON string
activation_all_post200_response_activations_inner_instance = ActivationAllPost200ResponseActivationsInner.from_json(json)
# print the JSON string representation of the object
print(ActivationAllPost200ResponseActivationsInner.to_json())

# convert the object into a dict
activation_all_post200_response_activations_inner_dict = activation_all_post200_response_activations_inner_instance.to_dict()
# create an instance of ActivationAllPost200ResponseActivationsInner from a dict
activation_all_post200_response_activations_inner_from_dict = ActivationAllPost200ResponseActivationsInner.from_dict(activation_all_post200_response_activations_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


