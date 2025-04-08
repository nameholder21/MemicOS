> Scratchpad README. Needs cleanup.

### Example Commands

#### Generate Source/SAE Dashboards + Convert to MemicOS Format

```
# from SAEDashboard repo
poetry run memicos-runner \
    --sae-set="gemma-2-9b-res-matryoshka-dc" \
    --sae-path="blocks.20.hook_resid_post" \
    --np-set-name="matryoshka-res-dc" \
    --dataset-path="monology/pile-uncopyrighted" \
    --output-dir="memicos_outputs_2/" \
    --sae_dtype="float32" \
    --model_dtype="bfloat16" \
    --sparsity-threshold=1 \
    --n-prompts=24576 \
    --n-tokens-in-prompt=128 \
    --n-features-per-batch=128 \
    --n-prompts-in-forward-pass=128
```

```
python convert-saedashboard-to-memicos-export.py \
    --saedashboard-output-dir=SAEDashboard/memicos_outputs_2/gemma-2-9b_gemma-2-9b-res-matryoshka-dc_blocks.20.hook_resid_post_32768 \
    --creator-name='David Chanin' \
    --release-id=res-matryoshka-dc \
    --release-title='A Bunch of Matryoshka SAEs' \
    --url=https://huggingface.co/chanind/gemma-2-9b-batch-topk-matryoshka-saes-w-32k-l0-60 \
    --model-name=gemma-2-9b \
    --memicos-source-set-id=res-matryoshka-dc \
    --memicos-source-set-description='Residual Stream - 32k' \
    --hf-weights-repo-id=chanind/gemma-2-9b-batch-topk-matryoshka-saes-w-32k-l0-60 \
    --hf-weights-path=blocks.20.hook_resid_post \
    --hook-point=hook_resid_post \
    --layer-num=20 \
    --prompts-huggingface-dataset-path=monology/pile-uncopyrighted \
    --n-prompts-total=24576 \
    --n-tokens-in-prompt=128
```

### Syncing Local Exports with S3

```
aws configure set default.s3.multipart_threshold 64MB
aws configure set default.s3.max_concurrent_requests 64
cd memicos_utils/exports
aws s3 sync . s3://memicos-datasets/v1 --delete --exclude ".DS_Store" --exclude "\*.DS_Store"
```
