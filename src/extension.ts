// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// to check if a string is likely a windows file path
function isWindowsPath(text: string): boolean {
	// windows path must contain a driver letter
	const hasDriverLetter = /^[a-zA-Z]:\\/.test(text);

	// must contain more than just one backslash to distinguish from simple escape characters
	const hasMultiBackslashes = (text.match(/\\/g) || []).length > 1;

	// must not contain common code escape sequences
	const isCodeSnippet = text.includes("\\n") || text.includes("\\t") || text.includes(`\\"`) || text.includes(`\\'`);

	return hasDriverLetter && hasMultiBackslashes && !isCodeSnippet
}


// function to convert a windows path to a linux-style path
function convertPath(text: string): string {
	// replace all backslashes with forward slashes
	return text.replace(/\\/g, "/");
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// console.log('Congratulations, your extension "paste-windows-url" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('paste-windows-url.paste', async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		// get content from clipboard
		const clipboardText = await vscode.env.clipboard.readText();

		const isPath = isWindowsPath(clipboardText);

		if (isPath) {
			const convertedPath = convertPath(clipboardText);
			editor.edit(editBuilder => {
				const position = editor.selection.active;
				editBuilder.insert(position, convertedPath);
			});
		} else {
			vscode.commands.executeCommand("editor.action.clipboardPasteAction");
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
