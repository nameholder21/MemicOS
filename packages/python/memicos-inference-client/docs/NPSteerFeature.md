# NPSteerFeature


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model** | **str** |  | 
**source** | **str** |  | 
**index** | **int** |  | 
**strength** | **float** |  | 
**steering_vector** | **List[float]** |  | [optional] 

## Example

```python
from memicos_inference_client.models.np_steer_feature import NPSteerFeature

# TODO update the JSON string below
json = "{}"
# create an instance of NPSteerFeature from a JSON string
np_steer_feature_instance = NPSteerFeature.from_json(json)
# print the JSON string representation of the object
print(NPSteerFeature.to_json())

# convert the object into a dict
np_steer_feature_dict = np_steer_feature_instance.to_dict()
# create an instance of NPSteerFeature from a dict
np_steer_feature_from_dict = NPSteerFeature.from_dict(np_steer_feature_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


