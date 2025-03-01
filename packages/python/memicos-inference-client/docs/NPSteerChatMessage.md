# NPSteerChatMessage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **str** | The chat message | 
**role** | **str** | The role of the message (eg \&quot;model\&quot;, \&quot;user\&quot;, etc) | 

## Example

```python
from memicos_inference_client.models.np_steer_chat_message import NPSteerChatMessage

# TODO update the JSON string below
json = "{}"
# create an instance of NPSteerChatMessage from a JSON string
np_steer_chat_message_instance = NPSteerChatMessage.from_json(json)
# print the JSON string representation of the object
print(NPSteerChatMessage.to_json())

# convert the object into a dict
np_steer_chat_message_dict = np_steer_chat_message_instance.to_dict()
# create an instance of NPSteerChatMessage from a dict
np_steer_chat_message_from_dict = NPSteerChatMessage.from_dict(np_steer_chat_message_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


