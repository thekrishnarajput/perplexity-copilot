import * as vscode from "vscode";
import fetch from "node-fetch";
import { ModelManager } from "./modelManager";

export class ApiClient {
    private secrets: vscode.SecretStorage;
    private endpoint: string;
    private modelManager: ModelManager;
    private abortControllers = new Set<AbortController>();

    constructor(secrets: vscode.SecretStorage, endpoint: string, modelManager: ModelManager) {
        this.secrets = secrets;
        this.endpoint = endpoint;
        this.modelManager = modelManager;
    }

    // Get API key from SecretStorage — always async
    private async getApiKey() {
        const key = await this.secrets.get("perplexity.apiKey");
        if (!key) {
            throw new Error("Perplexity API key not set. Use 'Perplexity: Set API Token'.");
        }
        return key;
    }

    // Basic request wrapper for non-stream calls
    async requestCompletion(prompt: string) {
        const apiKey = await this.getApiKey();
        const model = this.modelManager.getCurrentModel();
        const res = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                input: prompt,
                max_tokens: 512
            })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text}`);
        }
        return await res.json();
    }

    // Streaming generator: yields chunks as strings (works with API that streams via chunked responses)
    async *streamChat(prompt: string, signal?: AbortSignal): AsyncGenerator<string> {
        const apiKey = await this.getApiKey();
        const model = this.modelManager.getCurrentModel();
        const controller = new AbortController();
        if (signal) {
            signal.addEventListener("abort", () => controller.abort());
        }
        this.abortControllers.add(controller);

        const response:any = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Accept: "text/event-stream"
            },
            body: JSON.stringify({
                model,
                input: prompt,
                stream: true
            }),
            signal: controller.signal
        });

        if (!response.ok || !response.body) {
            const txt = await response.text();
            throw new Error(`Streaming API error ${response.status}: ${txt}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        try {
            while (!done) {
                const result = await reader.read();
                done = !!result.done;
                if (result.value) {
                    const chunk = decoder.decode(result.value, { stream: true });
                    // Basic sanitization: remove control characters except newline/tab
                    const safeChunk = chunk.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
                    yield safeChunk;
                }
            }
        } finally {
            reader.releaseLock();
            this.abortControllers.delete(controller);
        }
    }

    dispose() {
        // Abort ongoing streaming calls on dispose
        for (const ctl of this.abortControllers) {
            try {
                ctl.abort();
            } catch (_) { }
        }
        this.abortControllers.clear();
    }
}
