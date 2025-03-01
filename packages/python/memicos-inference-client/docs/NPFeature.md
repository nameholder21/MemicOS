# NPFeature

A feature in MemicOS, identified by model, source, and index.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model** | **str** |  | 
**source** | **str** |  | 
**index** | **int** |  | 

## Example

```python
from memicos_inference_client.models.np_feature import NPFeature

# TODO update the JSON string below
json = "{}"
# create an instance of NPFeature from a JSON string
np_feature_instance = NPFeature.from_json(json)
# print the JSON string representation of the object
print(NPFeature.to_json())

# convert the object into a dict
np_feature_dict = np_feature_instance.to_dict()
# create an instance of NPFeature from a dict
np_feature_from_dict = NPFeature.from_dict(np_feature_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


