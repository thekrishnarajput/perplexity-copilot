import * as vscode from "vscode";
import { ApiClient } from "./apiClient";

export class PerplexityCompletionProvider implements vscode.CompletionItemProvider {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.CompletionItem[] | vscode.CompletionList | null> {
        try {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            // Only trigger in certain contexts to avoid noise.
            if (!linePrefix.trim()) return null;

            // Create a short prompt based on current file and line
            const prompt = `Complete the following code snippet. File language: ${document.languageId}\n\n${linePrefix}\n\nContinuation:`;
            const res:any = await this.client.requestCompletion(prompt);
            const text = (res?.choices?.[0]?.text ?? "").trim();
            if (!text) return null;

            const item = new vscode.CompletionItem(text, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(text);
            item.detail = "Perplexity suggestion";
            return [item];
        } catch (err) {
            console.error("compilation provider catch err:-", err);
            // Fail silently — don't spam user
            return null;
        }
    }
}
