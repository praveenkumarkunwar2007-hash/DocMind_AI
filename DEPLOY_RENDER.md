# Deploy DocMind AI on Render Free (Static Site)

This project is designed to use **Render Static Sites**, which Render documents as free to deploy. Do **not** create a paid Web Service, private service, or background worker. A static site has no runtime server and no compute plan.

## What this deployment does

- Render serves the frontend as static files from its CDN.
- Each visitor's browser runs Qwen2.5 1.5B Instruct using WebLLM/WebGPU.
- Documents, extracted text, and chat history are stored in the visitor's own browser (IndexedDB).
- There is no Python backend, no hosted Ollama service, and no AI inference API.
- Your PC can be off after deployment.

On first use, the browser must download model files from the model/static asset hosts used by WebLLM. This downloads weights, it does not send prompts to an AI inference endpoint. Model loading requires internet the first time; model and device compatibility vary.

## Option A (simplest): create a Static Site from the dashboard

1. Push **the contents** of this project folder to a GitHub repository. The repository root must contain `package.json`, `.node-version`, `index.html`, `vite.config.js`, `src/`, and `render.yaml`.
2. Do not upload `node_modules/`, `dist/`, private documents, `.env` files, credentials, or keys.
3. Open <https://dashboard.render.com/>.
4. Choose **New + → Static Site**. Do not select Web Service.
5. Connect GitHub, choose the repository, and select branch `main`.
6. Enter these exact settings:

   - **Name:** `docmind-ai-browser-local-free` (or a unique name you choose)
   - **Branch:** `main`
   - **Root Directory:** leave blank if the `package.json` is at the repository root
   - **Build Command:** `npm install --no-audit --no-fund && npm run build`
   - **Publish Directory:** `dist`

7. Create the Static Site. Static Sites do not have a compute plan; they are free to deploy. Render free static sites still count against monthly included bandwidth and build-pipeline usage, so the allowance is not unlimited.
8. After the initial deployment, open **Settings → Headers** and confirm/add the following headers:

   | Path | Header | Value |
   |---|---|---|
   | `/*` | `Cross-Origin-Opener-Policy` | `same-origin` |
   | `/*` | `Cross-Origin-Embedder-Policy` | `require-corp` |
   | `/*` | `X-Content-Type-Options` | `nosniff` |
   | `/*` | `Referrer-Policy` | `strict-origin-when-cross-origin` |
   | `/*` | `X-Frame-Options` | `DENY` |
   | `/assets/*` | `Cache-Control` | `public, max-age=31536000, immutable` |
   | `/index.html` | `Cache-Control` | `no-cache` |

   The `render.yaml` includes these settings when deploying through a Blueprint. If you created the site manually, enter them in Dashboard → Settings → Headers.
9. Trigger **Manual Deploy → Deploy latest commit** after saving headers.
10. Open the `https://....onrender.com` URL in a current Chrome or Edge browser with WebGPU support. Click **Load local AI** and wait for the model download and initialization. The initial download may be about 880 MB and can take minutes.

## Option B: use the included Blueprint

The repository includes `render.yaml`. In Render choose **New + → Blueprint**, connect the repository, review the detected resource, and apply it. Confirm that the resulting resource is a **Static Site** (`runtime: static`) and that there are no paid services or databases listed. There is no `plan` field because Static Sites don't use a compute plan.

## Free-tier and functional limitations

- Render's Static Site service is free but not unlimited. It counts against included bandwidth and build-pipeline limits. Check your dashboard for current usage and allowances.
- AI is not processed on Render. Each visitor's device provides GPU/memory and runs the model. Some devices may not support WebGPU or have enough memory.
- The configured Qwen2.5 1.5B Instruct WebLLM build has an estimated GPU memory need around 1,630 MB (about 1.63 GB); real requirements vary by device and browser.
- Files and chat history live in each visitor's IndexedDB. The same user won't automatically get the same library on a different device/browser; clearing browser data can erase it.
- There is no shared user account, shared document library, server-side backups, or cross-device sync in this no-backend edition.
- This has no AI inference API. It does require a one-time/first-use static download of model/runtime assets from external hosts. If no external connections of any kind are allowed, those assets would need to be hosted/bundled with the site, increasing bandwidth/storage substantially.
- Scanned PDFs without selectable text need OCR; OCR is not included.

## Troubleshooting

### Build fails

Check Render build logs. Make sure the repository root contains `package.json`, `index.html`, `vite.config.js`, and `src/`. Use Node version `24.21.0` from `.node-version` or set `NODE_VERSION=24.21.0` in the static site settings. Build command and publish directory must match the values above.

### Website opens but local AI won't load

- Use an up-to-date Chrome/Edge and check WebGPU support.
- Confirm the COOP and COEP headers are present in the response.
- Check browser Developer Tools → Console/Network for blocked model asset requests. Model asset hosts must permit cross-origin fetching.
- Retry after checking network filtering and available device memory.

### GitHub changes don't appear

Check that Render is connected to the expected repository and `main` branch. Trigger **Manual Deploy → Deploy latest commit**.


## Model download reliability update

The browser model loader has been updated to:
- use the official WebLLM prebuilt `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` model entry and its compatible packaged WASM runtime;
- use WebLLM's IndexedDB cache backend instead of the default Cache API, to reduce `Cache.add() encountered a network error` failures on some browser/network combinations;
- retry one time after a network/cache download error;
- show more actionable error guidance after the retry fails.

Model weights are still downloaded to the visitor's browser from the model-hosting source on first use. This is a model-file download only; inference remains local and no AI inference API is used. A blocked network, browser storage restrictions, unsupported WebGPU, low GPU memory, or model host outage can still cause a failure.

After updating the repository, wait for Render to deploy the new commit, then open the site in Chrome/Edge and click **Retry model load**. If the old code still appears, do a hard refresh (Ctrl+F5) and verify the new commit is deployed.
