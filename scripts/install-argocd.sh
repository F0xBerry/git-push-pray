#!/usr/bin/env bash
# Install Argo CD into the current cluster context, then register the Scout Application.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

echo "Installing Argo CD v2.13.5 (kustomize + insecure UI patch for local port-forward)..."
kubectl apply -k "${ROOT}/platform/argocd/install"

echo "Waiting for argocd-server..."
kubectl rollout status deployment/argocd-server -n argocd --timeout=300s

echo "Registering Application scout-dev..."
kubectl apply -f "${ROOT}/platform/argocd/application-dev.yaml"

echo ""
echo "Initial admin password (rotate after first login):"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""
echo ""
echo "UI: kubectl port-forward svc/argocd-server -n argocd 8080:80"
echo "Then open http://localhost:8080  user: admin"
