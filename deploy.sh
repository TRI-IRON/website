#!/usr/bin/env bash
# Deploy the Tri-Iron site to Cloudflare Pages.
# Usage: ./deploy.sh
set -euo pipefail

DIST=_dist
rm -rf "$DIST"
mkdir -p "$DIST"
cp -r index.html assets _redirects "$DIST/"

wrangler pages deploy "$DIST" \
  --project-name=website \
  --branch=main \
  --commit-dirty=true

rm -rf "$DIST"
echo "Deployed. Production URL: https://website-bax.pages.dev"
