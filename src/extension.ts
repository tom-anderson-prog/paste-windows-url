// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function convertPath(text: string): string {
	let newPath = text.replace(/\\/g, "/");

	return newPath;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "paste-windows-url" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('paste-windows-url.paste', async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const clipboardText = await vscode.env.clipboard.readText();

		const convertedPath = convertPath(clipboardText);

		editor.edit(editBuilder => {
			const position = editor.selection.active;
			editBuilder.insert(position, convertedPath);
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
