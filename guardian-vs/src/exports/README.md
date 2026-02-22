# Guardian API

The Guardian extension exposes an API that can be used by other extensions. To use this API in your extension:

1. Copy `src/extension-api/guardian.d.ts` to your extension's source directory.
2. Include `guardian.d.ts` in your extension's compilation.
3. Get access to the API with the following code:

    ```ts
    const guardianExtension = vscode.extensions.getExtension<GuardianAPI>("saoudrizwan.claude-dev")

    if (!guardianExtension?.isActive) {
    	throw new Error("Guardian extension is not activated")
    }

    const guardian = guardianExtension.exports

    if (guardian) {
    	// Now you can use the API

    	// Start a new task with an initial message
    	await guardian.startNewTask("Hello, Guardian! Let's make a new project...")

    	// Start a new task with an initial message and images
    	await guardian.startNewTask("Use this design language", ["data:image/webp;base64,..."])

    	// Send a message to the current task
    	await guardian.sendMessage("Can you fix the @problems?")

    	// Simulate pressing the primary button in the chat interface (e.g. 'Save' or 'Proceed While Running')
    	await guardian.pressPrimaryButton()

    	// Simulate pressing the secondary button in the chat interface (e.g. 'Reject')
    	await guardian.pressSecondaryButton()
    } else {
    	console.error("Guardian API is not available")
    }
    ```

    **Note:** To ensure that the `saoudrizwan.claude-dev` extension is activated before your extension, add it to the `extensionDependencies` in your `package.json`:

    ```json
    "extensionDependencies": [
        "saoudrizwan.claude-dev"
    ]
    ```

For detailed information on the available methods and their usage, refer to the `guardian.d.ts` file.
