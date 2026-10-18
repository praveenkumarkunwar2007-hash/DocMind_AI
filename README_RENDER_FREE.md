# Render Free plan — quick steps

This package is configured for **Render Static Sites**, which Render documents as free to deploy. It does not create a paid compute service. No backend, no Ollama server, and no AI inference API are used.

1. Upload the contents of this folder to a GitHub repository; keep `package.json` at the repository root.
2. In Render choose **New + → Static Site** (not Web Service).
3. Connect the repository and select the `main` branch.
4. Build command: `npm install --no-audit --no-fund && npm run build`
5. Publish directory: `dist`
6. Create the Static Site. Static sites have no compute plan to select.
7. After deployment, open Settings → Headers and ensure the COOP and COEP headers in `render.yaml` are configured. If using the Blueprint workflow, Render reads them from `render.yaml`.
8. Redeploy and visit the Render URL in a current Chrome/Edge browser. Click **Load local AI** to download and initialize the browser-local model.

The browser downloads model files from external static hosts on first use, but prompts/documents aren't sent to an AI inference API. The free hosting allowance is limited by bandwidth/build usage, and inference works only on visitors' devices that support WebGPU and have enough memory.
