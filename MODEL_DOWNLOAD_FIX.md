# Browser model loading configuration

This project uses the built-in WebLLM model configuration for Qwen2.5-1.5B-Instruct-q4f16_1-MLC. It pins WebLLM exactly to 0.2.82 because the reported `Object has already been disposed` issue affects 0.2.83+ on some integrated GPUs and the issue report identifies 0.2.82 as unaffected.

Model files are downloaded on first use and cached with the version-appropriate IndexedDB configuration. No AI inference API is called. The initial model and runtime downloads still require a stable internet connection.
