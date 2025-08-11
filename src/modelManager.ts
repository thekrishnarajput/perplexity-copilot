import * as vscode from "vscode";

export class ModelManager {
    private config: vscode.WorkspaceConfiguration;

    // list of available models (example). Keep updated by checking Perplexity docs.
    readonly availableModels = ["sonar-pro", "pplx-7b-chat", "pplx-13b-chat"];

    constructor(config: vscode.WorkspaceConfiguration) {
        this.config = config;
    }

    getCurrentModel(): string {
        return this.config.get<string>("model", this.availableModels[0]);
    }

    async chooseModel(): Promise<string | undefined> {
        const pick = await vscode.window.showQuickPick(this.availableModels, {
            placeHolder: "Select Perplexity model"
        });
        if (pick) {
            await this.config.update("model", pick, vscode.ConfigurationTarget.Global);
        }
        return pick;
    }
}
