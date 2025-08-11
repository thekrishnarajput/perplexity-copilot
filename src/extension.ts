import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("Hello from Perplexity Copilot!");
}

export function deactivate() { }
