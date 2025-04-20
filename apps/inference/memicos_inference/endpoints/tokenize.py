import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from memicos_inference_client.models.tokenize_post200_response import (
    TokenizePost200Response,
)
from memicos_inference_client.models.tokenize_post_request import (
    TokenizePostRequest,
)

from memicos_inference.config import Config
from memicos_inference.shared import Model, with_request_lock

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/tokenize")
@with_request_lock()
async def tokenize(
    request: TokenizePostRequest,
):
    model = Model.get_instance()
    config = Config.get_instance()

    prepend_bos = (
        request.prepend_bos
        if request.prepend_bos is not None
        else model.cfg.default_prepend_bos
    )

    tokens = model.to_tokens(
        request.text,
        prepend_bos=prepend_bos,
        truncate=False,
    )[0]

    if len(tokens) > config.TOKEN_LIMIT:
        logger.error(
            "Text too long: %s tokens, max is %s",
            len(tokens),
            config.TOKEN_LIMIT,
        )
        return JSONResponse(
            content={
                "error": f"Text too long: {len(tokens)} tokens, max is {config.TOKEN_LIMIT}"
            },
            status_code=400,
        )

    str_tokens = model.to_str_tokens(request.text, prepend_bos=prepend_bos)

    return TokenizePost200Response(
        tokens=tokens.tolist(),
        token_strings=str_tokens,  # type: ignore
        prepend_bos=prepend_bos,
    )
