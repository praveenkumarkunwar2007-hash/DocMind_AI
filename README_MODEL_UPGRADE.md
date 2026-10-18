# DocMind AI — Qwen2.5 1.5B upgrade

This project selects the prebuilt WebLLM model `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`, supported in `@mlc-ai/web-llm` `0.2.82`. Official WebLLM config estimates roughly 1,629.75 MB of GPU memory; device support varies.

## What changed

- Model: Qwen2.5 0.5B → Qwen2.5 1.5B Instruct (q4f16_1 quantization).
- WebLLM remains pinned to exactly `0.2.82` for the existing runtime-stability workaround.
- The app keeps a 2,048-token context cap to reduce memory pressure.
- The response cap is increased to 240 tokens to allow more useful summaries.
- Summarization and comparison context samples the beginning, middle, and end of up to three documents instead of using only the opening text.
- Initial browser model download is about 880 MB; the model files are cached after download if browser storage permits.

## No inference API

The model runs inside each visitor's browser through WebLLM/WebGPU. There is no Ollama backend, hosted inference API, or server-side processing of documents. Model/runtime files are fetched from public static model hosts on first use; document text and prompts are not sent to those model hosts for inference.

## Limitations

- WebGPU is required. The model's official WebLLM configuration estimates about 1.63 GB GPU memory, and some devices may require more or fail to run it.
- The first download is larger than the prior 0.5B model and may be slow on limited connections.
- Browser-local documents/history do not sync between browsers or devices and can be removed by clearing site data.
- Summaries/comparisons sample up to three documents and include representative beginning, middle and end passages to fit within the bounded context. This is not a full-document, unlimited-context analysis.
- The JavaScript syntax and package configuration were checked, but a production build and inference on a real target browser must still be verified by Render/browser testing.
