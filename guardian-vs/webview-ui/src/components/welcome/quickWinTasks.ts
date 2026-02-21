export interface QuickWinTask {
	id: string
	title: string
	description: string
	icon?: string
	actionCommand: string
	prompt: string
	buttonText?: string
}

export const quickWinTasks: QuickWinTask[] = [
	{
		id: "todo_lists_workflows",
		title: "Welcome, use todo lists and workflows to drive production",
		description: "Get started with productivity tools",
		icon: "WebAppIcon",
		actionCommand: "guardian/createNextJsApp",
		prompt: "Explain how to use todo lists and workflows to drive production in Guardian",
		buttonText: ">",
	},
	{
		id: "setup_rules_settings",
		title: "Setup rules in settings",
		description: "Configure your preferences",
		icon: "TerminalIcon",
		actionCommand: "guardian/createCliTool",
		prompt: "Show me how to setup rules in settings for Guardian",
		buttonText: ">",
	},
	{
		id: "connect_your_api",
		title: "Connect to your API",
		description: "Integrate with external services",
		icon: "GameIcon",
		actionCommand: "guardian/createSnakeGame",
		prompt: "Guide me through connecting to my API with Guardian",
		buttonText: ">",
	},
]
