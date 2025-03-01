# NPSteerVector

A raw vector for steering, including its hook and strength

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**steering_vector** | **List[float]** |  | 
**strength** | **float** |  | 
**hook** | **str** |  | 

## Example

```python
from memicos_inference_client.models.np_steer_vector import NPSteerVector

# TODO update the JSON string below
json = "{}"
# create an instance of NPSteerVector from a JSON string
np_steer_vector_instance = NPSteerVector.from_json(json)
# print the JSON string representation of the object
print(NPSteerVector.to_json())

# convert the object into a dict
np_steer_vector_dict = np_steer_vector_instance.to_dict()
# create an instance of NPSteerVector from a dict
np_steer_vector_from_dict = NPSteerVector.from_dict(np_steer_vector_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


