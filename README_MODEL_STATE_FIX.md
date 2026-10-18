# DocMind AI — model state fix

This is a browser-local AI static-site update for the existing Render deployment.

## What's changed

- Uses the explicit WebLLM lifecycle: instantiate `MLCEngine`, then await `reload(MODEL_ID)`.
- The app only sets its engine reference after model loading completes.
- If chat receives a model-not-loaded error, the stale engine is discarded and the UI asks the visitor to reload the model instead of repeatedly submitting requests to an unloaded engine.
- No AI inference API or hosted AI backend is added. Inference remains in the visitor's browser.

## Apply

Copy the contents of this folder into the root of your existing GitHub repository, allow matching files to be replaced, commit, and push. Render should redeploy from the linked branch. Hard-refresh the site afterward.

If the loader still fails, inspect the full error shown in the model status panel. This patch targets the model-not-loaded state; it cannot fix WebGPU incompatibility or network failures fetching the model files.
