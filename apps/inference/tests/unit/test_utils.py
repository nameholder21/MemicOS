import pytest
from memicos_inference.utils import reverse_chat_template
from transformers import AutoTokenizer


@pytest.fixture(scope="module")
def mock_tokenizer():
    # Start with a real GPT-2 tokenizer
    real_tokenizer = AutoTokenizer.from_pretrained("google/gemma-2-2b-it")
    return real_tokenizer


def test_reverse_chat_template_single_turn(mock_tokenizer):
    text = "<bos><start_of_turn>user Hello<end_of_turn><eos>"
    result = reverse_chat_template(text, mock_tokenizer)

    expected = [{"role": "user", "content": "Hello"}]

    assert result == expected


def test_reverse_chat_template_multiple_turns(mock_tokenizer):
    text = "<bos><start_of_turn>user Hello<end_of_turn><start_of_turn>model Hi there!<end_of_turn><start_of_turn>user How are you?<end_of_turn><start_of_turn>model I'm doing well, thanks for asking!<end_of_turn><eos>"
    result = reverse_chat_template(text, mock_tokenizer)

    expected = [
        {"role": "user", "content": "Hello"},
        {"role": "model", "content": "Hi there!"},
        {"role": "user", "content": "How are you?"},
        {"role": "model", "content": "I'm doing well, thanks for asking!"},
    ]

    assert result == expected


def test_reverse_chat_template_empty(mock_tokenizer):
    text = "<bos><eos>"
    result = reverse_chat_template(text, mock_tokenizer)
    assert result == []


def test_reverse_chat_template_incomplete_turn(mock_tokenizer):
    text = "<bos><start_of_turn>user Hello<end_of_turn><start_of_turn>model<eos>"
    result = reverse_chat_template(text, mock_tokenizer)

    expected = [{"role": "user", "content": "Hello"}]

    assert result == expected


def test_reverse_chat_template_multiple_messages_same_role(mock_tokenizer):
    text = "<bos><start_of_turn>user Hello<end_of_turn><start_of_turn>user How are you?<end_of_turn><start_of_turn>model I'm fine, thanks!<end_of_turn><eos>"

    result = reverse_chat_template(text, mock_tokenizer)

    expected = [
        {"role": "user", "content": "Hello"},
        {"role": "user", "content": "How are you?"},
        {"role": "model", "content": "I'm fine, thanks!"},
    ]

    assert result == expected
