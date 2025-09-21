// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// to check if a string is likely a windows file path
function isWindowsPath(text: string): boolean {
	const windowsPathRegex = /^[a-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
    return windowsPathRegex.test(text);
}

// function to convert a windows path to a linux-style path
function convertPath(text: string): string {
	// replace all backslashes with forward slashes
	return text.replace(/\\/g, "/");
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "windows-to-linux-path" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('windows-to-linux-path.paste', async () => {

		const editor = vscode.window.activeTextEditor;
		console.log('heihei',editor);
		if (!editor) {
			return;
		}

		// get content from clipboard
		const clipboardText = await vscode.env.clipboard.readText();

		const isPath = isWindowsPath(clipboardText);

		console.log('2', clipboardText, isPath);

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
