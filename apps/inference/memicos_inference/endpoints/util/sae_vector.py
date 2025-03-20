import logging

from fastapi import APIRouter
from memicos_inference_client.models.util_sae_vector_post200_response import (
    UtilSaeVectorPost200Response,
)
from memicos_inference_client.models.util_sae_vector_post_request import (
    UtilSaeVectorPostRequest,
)

from memicos_inference.sae_manager import SAEManager
from memicos_inference.shared import (
    with_request_lock,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/util/sae-vector")
@with_request_lock()
async def sae_vector(request: UtilSaeVectorPostRequest):
    source = request.source
    index = request.index

    sae = SAEManager.get_instance().get_sae(source)

    result = sae.W_enc[:, index].detach().tolist()

    logger.info("Returning result: %s", result)

    return UtilSaeVectorPost200Response(vector=result)
