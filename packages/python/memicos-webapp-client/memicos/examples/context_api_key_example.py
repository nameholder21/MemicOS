"""
Example demonstrating the new context-based API key management using contextvars.
This provides a much cleaner API compared to passing api_key to every constructor.
"""

import memicos


def example_context_manager():
    """Using context manager (recommended for temporary scope)"""
    print("=== Context Manager Example ===")

    with memicos.api_key("your-api-key-here"):
        # All request classes within this context automatically use the API key
        feature_request = memicos.FeatureRequest()
        model_request = memicos.ModelRequest()
        graph_request = memicos.GraphRequest()

        print("✅ All request classes created with context API key")
        # You can create as many request instances as needed without repeating the key

    # Outside the context, the API key is no longer set
    print("Context exited - API key no longer in scope")


def example_global_setting():
    """Using global context setting (good for application-wide usage)"""
    print("\n=== Global Setting Example ===")

    memicos.set_api_key("your-api-key-here")

    # Now all request classes will use this API key
    feature_request = memicos.FeatureRequest()
    vector_request = memicos.VectorRequest()
    steer_request = memicos.SteerChatRequest()

    print("✅ All request classes created with global context API key")


def example_mixed_usage():
    """Demonstrating mixed usage - explicit parameter overrides context"""
    print("\n=== Mixed Usage Example ===")

    memicos.set_api_key("global-api-key")

    # This uses the global context key
    feature_request1 = memicos.FeatureRequest()

    # This overrides with explicit parameter
    feature_request2 = memicos.FeatureRequest(api_key="explicit-api-key")

    # This uses context manager, temporarily overriding global setting
    with memicos.api_key("context-api-key"):
        feature_request3 = memicos.FeatureRequest()

        # Even explicit parameter still works within context
        feature_request4 = memicos.FeatureRequest(api_key="another-explicit-key")

    print("✅ Mixed usage - explicit parameters override context")


def example_nested_contexts():
    """Demonstrating nested context managers"""
    print("\n=== Nested Contexts Example ===")

    with memicos.api_key("outer-key"):
        feature_request1 = memicos.FeatureRequest()
        print("Outer context: created request with outer-key")

        with memicos.api_key("inner-key"):
            feature_request2 = memicos.FeatureRequest()
            print("Inner context: created request with inner-key")

        # Back to outer context
        feature_request3 = memicos.FeatureRequest()
        print("Back to outer context: created request with outer-key")

    print("✅ Nested contexts work correctly")


if __name__ == "__main__":
    print("Demonstrating context-based API key management...")
    print("Note: Replace 'your-api-key-here' with actual API keys to test")

    # example_context_manager()
    # example_global_setting()
    # example_mixed_usage()
    # example_nested_contexts()

    print("\nThis approach is much cleaner than:")
    print("  feature_request = FeatureRequest(api_key='key')")
    print("  model_request = ModelRequest(api_key='key')")
    print("  graph_request = GraphRequest(api_key='key')")
    print("  # ... repeating for every single request class")
