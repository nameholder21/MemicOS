# UtilSaeVectorPostRequest

Get the raw vector for an SAE feature

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model** | **str** |  | 
**source** | **str** |  | 
**index** | **int** |  | 

## Example

```python
from memicos_inference_client.models.util_sae_vector_post_request import UtilSaeVectorPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UtilSaeVectorPostRequest from a JSON string
util_sae_vector_post_request_instance = UtilSaeVectorPostRequest.from_json(json)
# print the JSON string representation of the object
print(UtilSaeVectorPostRequest.to_json())

# convert the object into a dict
util_sae_vector_post_request_dict = util_sae_vector_post_request_instance.to_dict()
# create an instance of UtilSaeVectorPostRequest from a dict
util_sae_vector_post_request_from_dict = UtilSaeVectorPostRequest.from_dict(util_sae_vector_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


