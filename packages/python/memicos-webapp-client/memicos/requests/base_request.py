import os
import requests
from dotenv import load_dotenv

load_dotenv()


class NPKeyMissingError(Exception):
    """The environment variable 'MEMICOS_API_KEY' is not set."""

    pass


class NPUnauthorizedError(Exception):
    """Unauthorized. Please check your MEMICOS_API_KEY environment variable."""

    pass


class NPRateLimitError(Exception):
    """Rate limit exceeded. Please try again later or email support@memicos.org to raise your limit."""

    pass


class NPInvalidResponseError(Exception):
    """The API returned an invalid JSON response. Please contact support@memicos.org."""

    pass


class NPRequest:
    USE_LOCALHOST = os.getenv("USE_LOCALHOST", False)
    BASE_URL = "https://memicos.org/api" if not USE_LOCALHOST else "http://localhost:3000/api"

    def __init__(
        self,
        endpoint: str,
    ):
        if not self.BASE_URL:
            raise ValueError("BASE_URL must be set in a subclass or globally.")
        self.endpoint = endpoint
        self.api_key = self._get_api_key()

    @staticmethod
    def _get_api_key():
        """Retrieve and validate the MEMICOS_API_KEY environment variable."""
        api_key = os.getenv("MEMICOS_API_KEY")
        if not api_key:
            raise NPKeyMissingError("The environment variable 'MEMICOS_API_KEY' is not set.")
        return api_key

    def get_url(
        self,
    ):
        """Construct the full URL for the request."""
        return f"{self.BASE_URL}/{self.endpoint}"

    def send_request(
        self,
        uri: str = "",
        method: str = "POST",
        **kwargs,
    ):
        """Send an HTTP request."""
        headers = kwargs.get(
            "headers",
            {},
        )
        headers["X-Api-Key"] = self.api_key
        url = f"{self.BASE_URL}/{self.endpoint}/{uri}"
        print(f"Sending {method} request to {url}")
        # print(f"Body: {json.dumps(kwargs.get('json', {}), indent=2)}")

        response = requests.request(
            method,
            url,
            headers=headers,
            **kwargs,
        )

        if response.status_code == 401:
            raise NPUnauthorizedError("Unauthorized. Please check your MEMICOS_API_KEY environment variable.")
        elif response.status_code == 404:
            raise requests.exceptions.HTTPError(f"Resource not found: {response.status_code}")
        elif response.status_code == 429:
            raise NPRateLimitError(
                "You've exceeded the API rate limit. Try later or email support@memicos.org to raise your limit."
            )
        elif 400 <= response.status_code < 500:
            raise requests.exceptions.HTTPError(f"Request failed with status {response.status_code}: {response.json()}")
        elif 500 <= response.status_code < 600:
            raise requests.exceptions.HTTPError(
                f"Server error occurred: {response.status_code}. Try again later or contact support@memicos.org."
            )
        response.raise_for_status()  # Raise an exception for HTTP errors
        try:
            response_json = response.json()
            print("Got a successful response.")
            # print(json.dumps(response_json, indent=2))
            return response_json
        except requests.exceptions.JSONDecodeError:
            print(f"Error: Response text: {response.text[:1024]}")
            raise NPInvalidResponseError(
                "The API returned an invalid JSON response. Please contact support@memicos.org."
            )
