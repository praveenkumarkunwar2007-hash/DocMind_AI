# DocMind AI — Model Download Fix

This update addresses the error shown by some browsers:

`Failed to execute 'add' on 'Cache': Cache.add() encountered a network error`

Changes:
1. Uses a verified WebLLM-compatible Qwen2.5 0.5B model repository maintained by SkillSafe AI.
2. Uses `cacheBackend: 'indexeddb'` instead of the default Cache API backend.
3. Retries the initialization once for typical network/cache failures.
4. Displays troubleshooting hints if the retry also fails.
5. Preconnects to the model host to reduce avoidable connection setup delay.

The browser downloads model artifacts on initial load. After download and caching, model generation is executed on the visitor's device. No AI inference API or hosted inference server is called.

## Apply the fix

1. Replace the existing repository files with the contents of the updated project ZIP.
2. Commit and push changes to the branch Render deploys (usually `main`).
3. Wait for Render to finish the new deployment.
4. Open the site in current Chrome or Edge and hard-refresh it.
5. Click **Load local AI**. The app automatically retries once after a transient model download/cache error.

## If it still fails

- Update Chrome or Edge and ensure hardware acceleration/WebGPU is enabled.
- Avoid Incognito/Guest mode; the browser must be able to store model data.
- Make sure there is enough free storage and memory.
- Temporarily test a different network if the model-hosting domains are blocked or interrupted.
- Open DevTools → Network and identify the first failed model request; the exact URL and status code distinguish CDN/network failure from device incompatibility.

Model files are delivered by an external static model host, but prompts and document content are not sent there for inference. This design does not use external AI inference APIs.
