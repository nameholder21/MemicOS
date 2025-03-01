# ========== initial setup

# install gcloud plugin

gcloud components install gke-gcloud-auth-plugin

# set project

gcloud config set project tokyo-griffin-401620
gcloud config set compute/zone us-central1-c
gcloud config set compute/region us-central1

# Create cluster with CPU node by default - gke's c4 doesn't support pd-balanced so we use c3

gcloud container clusters create memicos-inference \
 --num-nodes=1 \
 --machine-type=c3-highmem-8 \
 --addons=GcePersistentDiskCsiDriver \
 --disk-size=250 \
 --enable-autoscaling \
 --min-nodes=1 \
 --max-nodes=2

# Create GPU node pool

gcloud container node-pools create gpu-pool \
 --cluster=memicos-inference \
 --machine-type=a2-highgpu-1g \
 --disk-size=250 \
 --enable-autoscaling \
 --num-nodes=2 \
 --min-nodes=2 \
 --max-nodes=16

gcloud container node-pools create gpu-lite-pool \
 --cluster=memicos-inference \
 --machine-type=g2-standard-8 \
 --disk-size=250 \
 --enable-autoscaling \
 --num-nodes=1 \
 --min-nodes=1 \
 --max-nodes=10

# load gcloud creds into kubectl

gcloud container clusters get-credentials memicos-inference

# set secrets in gcloud kubectl

kubectl create secret generic server-secret --from-literal=SECRET='your-secret-value'
kubectl create secret generic hf-token --from-literal=HF_TOKEN='your-secret-value'
kubectl create secret generic sentry-dsn --from-literal=SENTRY_DSN='your-secret-value'

# ========= deployments / maintenance, etc

# load gcloud creds into kubectl

gcloud container clusters get-credentials memicos-inference

# deployments - for updating configs

kubectl apply -k apps/inference/k8s/overlays/cpu/gpt2-small && \
kubectl apply -k apps/inference/k8s/overlays/cpu/gpt2-small-public && \
kubectl apply -k k8s/overlays/gpu/gemma-2-2b-it-a && \
kubectl apply -k k8s/overlays/gpu/gemma-2-2b-it-b && \
kubectl apply -k k8s/overlays/gpu/gemma-2-2b-public && \
kubectl apply -k k8s/overlays/gpu/gemma-2-2b-it-public && \
kubectl apply -k k8s/overlays/gpu/gemma-2-9b-it-a && \
kubectl apply -k k8s/overlays/gpu/gemma-2-9b-it-b && \
kubectl apply -k k8s/overlays/gpu/gemma-2-2b && \
kubectl apply -k k8s/overlays/gpu/gemma-2-9b && \
kubectl apply -k k8s/overlays/gpu/deepseek-r1-distill-llama-8b && \
kubectl apply -k k8s/overlays/gpu/deepseek-r1-distill-llama-8b-b && \
kubectl apply -k k8s/overlays/gpu/llama-31-8b

# restarts to pick up new docker image

kubectl rollout restart deployment gpt2-small-cpu-memicos-inference && \
kubectl rollout restart deployment gpt2-small-public-cpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-2b-it-a-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-2b-it-b-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-2b-public-gpu-lite-memicos-inference && \
kubectl rollout restart deployment gemma-2-2b-it-public-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-9b-it-a-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-9b-it-b-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-2b-gpu-memicos-inference && \
kubectl rollout restart deployment gemma-2-9b-gpu-memicos-inference && \
kubectl rollout restart deployment deepseek-r1-distill-llama-8b-gpu-memicos-inference && \
kubectl rollout restart deployment deepseek-r1-distill-llama-8b-b-gpu-memicos-inference && \
kubectl rollout restart deployment llama-31-8b-gpu-memicos-inference

# delete example

kubectl delete -k k8s/overlays/gpu/gemma-2-2b-it-public

# updating pool configs

gcloud container node-pools update default-pool \
 --cluster=memicos-inference \
 --min-nodes=1 \
 --max-nodes=2

gcloud container node-pools update gpu-pool \
 --cluster=memicos-inference \
 --max-nodes=16

# =============== misc / debug

# preview changes for config

kubectl diff -k k8s/overlays/gpu/gemma-2-2b-it-a

# "ssh" into the container

kubectl exec -it deployment/gemma-2-2b-it-a-gpu-memicos-inference -- bash

# describe container for debugging launch errors

kubectl describe pod gpt2-small-cpu-memicos-inference
