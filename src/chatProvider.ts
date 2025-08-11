import * as vscode from "vscode";
import { ApiClient } from "./apiClient";
import { ModelManager } from "./modelManager";

export class PerplexityChatProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "perplexityChatView";
    private _view?: vscode.WebviewView;

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly apiClient: ApiClient,
        private readonly modelManager: ModelManager
    ) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (msg) => {
            if (msg.type === "send") {
                const prompt: string = msg.prompt;
                // Immediately echo into UI and then stream
                webviewView.webview.postMessage({ type: "append", text: "\n" });
                try {
                    for await (const chunk of this.apiClient.streamChat(prompt)) {
                        webviewView.webview.postMessage({ type: "append", text: chunk });
                    }
                    webviewView.webview.postMessage({ type: "done" });
                } catch (e) {
                    webviewView.webview.postMessage({ type: "error", error: String(e) });
                }
            } else if (msg.type === "chooseModel") {
                const pick = await this.modelManager.chooseModel();
                webviewView.webview.postMessage({ type: "modelChanged", model: pick });
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview) {
        const nonce = getNonce();
        return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perplexity Chat</title>
  <style>
    body { font-family: var(--vscode-editor-font-family); padding: 8px; color: var(--vscode-editor-foreground); }
    #output { white-space: pre-wrap; border: 1px solid var(--vscode-editorWidget-border); padding: 8px; height: 300px; overflow: auto; background: var(--vscode-panel-background); }
    #controls { margin-top: 8px; display:flex; gap:8px; }
    input[type="text"] { flex:1; padding:6px; }
    button { padding:6px 10px; }
  </style>
</head>
<body>
  <div id="output"></div>
  <div id="controls">
    <input id="prompt" type="text" placeholder="Ask Perplexity..." />
    <button id="send">Send</button>
    <button id="model">Model</button>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const out = document.getElementById('output');
    document.getElementById('send').addEventListener('click', () => {
      const p = document.getElementById('prompt').value;
      if (p.trim()) {
        out.textContent += "\\n> " + p + "\\n";
        vscode.postMessage({ type: 'send', prompt: p });
        document.getElementById('prompt').value = '';
      }
    });
    document.getElementById('model').addEventListener('click', () => {
      vscode.postMessage({ type: 'chooseModel' });
    });
    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg.type === 'append') {
        out.textContent += msg.text;
        out.scrollTop = out.scrollHeight;
      } else if (msg.type === 'done') {
        out.textContent += "\\n--- done ---\\n";
      } else if (msg.type === 'error') {
        out.textContent += "\\n[Error] " + msg.error + "\\n";
      } else if (msg.type === 'modelChanged') {
        out.textContent += "\\n[Model switched to " + msg.model + "]\\n";
      }
    });
  </script>
</body>
</html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
