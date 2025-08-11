# Perplexity Copilot

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/thekrishnarajput.perplexity-copilot?style=for-the-badge&label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=thekrishnarajput.perplexity-copilot)
[![Publisher](https://img.shields.io/visual-studio-marketplace/p/thekrishnarajput.perplexity-copilot?style=for-the-badge)](https://marketplace.visualstudio.com/publishers/thekrishnarajput)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

**Perplexity Copilot** is an unofficial Visual Studio Code extension that brings the power of Perplexity AI into your editor. Utilize your Perplexity Pro API key to get inline code suggestions, generate code from comments, and interact with a dedicated chat view.

> **Disclaimer:** This is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Perplexity AI.

## Features

*   **Inline Code Suggestions:** Get real-time code completions as you type.
*   **Generate Code from Comments:** Write a comment describing the function you need, and let Perplexity AI generate the code for you.
*   **Model Selection:** Choose from available Perplexity models to suit your needs (e.g., `sonar-pro`).
*   **API Token Management:** Easily set and manage your Perplexity API token directly within VS Code.
*   **Integrated Chat View:** A dedicated "Perplexity Chat" view in the explorer to interact with the AI.

## Requirements

You must have a **Perplexity Pro** subscription and a valid API key to use this extension. You can get your API key from your Perplexity Account Settings.

## Installation

1.  Open **Visual Studio Code**.
2.  Go to the **Extensions** view by clicking on the square icon in the sidebar or pressing `Ctrl+Shift+X`.
3.  Search for `Perplexity Copilot`.
4.  Click **Install**.

## Getting Started

1.  **Set Your API Token:**
    *   Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
    *   Run the **"Perplexity: Set API Token"** command.
    *   Paste your Perplexity API key and press `Enter`.

2.  **Generate Code from a Comment:**
    *   In a supported file (e.g., JavaScript, TypeScript, Python), write a comment describing what you want to do.
    *   Open the Command Palette (`Ctrl+Shift+P`).
    *   Run the **"Perplexity: Generate Code from Comment"** command. The generated code will appear below your comment.

3.  **Use Inline Suggestions:**
    *   Simply start typing in a supported file, and inline code suggestions will appear automatically.

## Extension Settings

This extension contributes the following settings to your VS Code `settings.json`:

*   `perplexity.model`: The default model to use for generation.
    *   **Default:** `"sonar-pro"`
*   `perplexity.apiEndpoint`: The Perplexity API endpoint.
    *   **Default:** `"https://api.perplexity.ai/chat/completions"`
*   `perplexity.inlineEnabled`: Enable or disable inline suggestions.
    *   **Default:** `true`

You can also change the model by running the **"Perplexity: Choose Model"** command from the Command Palette.

## Commands

*   `perplexity-copilot.setApiKey`: Perplexity: Set API Token
*   `perplexity-copilot.generateFromComment`: Perplexity: Generate Code from Comment
*   `perplexity-copilot.chooseModel`: Perplexity: Choose Model

## Building from Source

If you want to contribute or build the extension from the source code, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/thekrishnarajput/perplexity-copilot.git
    cd perplexity-copilot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Compile the TypeScript code:**
    ```bash
    npm run compile
    ```

4.  **Open in VS Code and Run:**
    *   Open the project folder in VS Code.
    *   Press `F5` to open a new Extension Development Host window with the extension running.

5.  **Package the extension:**
    To create a `.vsix` file for installation:
    ```bash
    npm run package
    ```

## Known Issues

No known issues at the moment. Please report any bugs or feature requests on the GitHub Issues page.

## Release Notes

### 0.1.0

*   Initial release of Perplexity Copilot.
*   Features: Inline suggestions, generate from comment, model selection, and chat view.

---

## License

ISC

**Enjoy coding with your AI copilot!**
