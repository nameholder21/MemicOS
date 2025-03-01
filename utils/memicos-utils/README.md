aws configure set default.s3.multipart_threshold 64MB
aws configure set default.s3.max_concurrent_requests 64
cd memicos_utils/exports
aws s3 sync . s3://memicos-datasets/v1 --delete --exclude ".DS_Store" --exclude "\*.DS_Store"
