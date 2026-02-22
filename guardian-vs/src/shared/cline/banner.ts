/**
 * Action types that can be triggered from banner buttons/links
 * Frontend maps these to actual handlers
 */
export enum BannerActionType {
	/** Open external URL */
	Link = "link",
	/** Open API settings tab */
	ShowApiSettings = "show-api-settings",
	/** Open feature settings tab */
	ShowFeatureSettings = "show-feature-settings",
	/** Open account/login view */
	ShowAccount = "show-account",
	/** Set the active model */
	SetModel = "set-model",
	/** Trigger CLI installation flow */
	InstallCli = "install-cli",
}

/**
 * Banner data structure for backend-to-frontend communication.
 * Backend constructs this JSON, frontend renders it via BannerCarousel.
 */
export interface BannerCardData {
	/** Unique identifier for the banner (used for dismissal tracking) */
	id: string

	/** Banner title text */
	title: string

	/** Banner description/body markdown text */
	description: string

	/**
	 * Icon ID from Lucide icon set (e.g., "lightbulb", "megaphone", "terminal")
	 * LINK: https://lucide.dev/icons/
	 * Optional - if omitted, no icon is shown
	 */
	icon?: string

	/**
	 * Optional footer action buttons
	 * Rendered below the description as prominent buttons
	 */
	actions?: BannerAction[]

	/**
	 * Platform filter - only show on specified platforms
	 * If undefined, show on all platforms
	 */
	platforms?: ("windows" | "mac" | "linux")[]

	/** Only show to Cline users */
	isClineUserOnly?: boolean
}

/**
 * Single action definition (button or link)
 */
export interface BannerAction {
	/** Button/link label text */
	title: string

	/**
	 * Action type - determines what happens on click
	 * Defaults to "link" if omitted
	 */
	action?: BannerActionType

	/**
	 * Action argument - interpretation depends on action type:
	 * - Link: URL to open
	 * - SetModel: model ID (e.g., "anthropic/claude-opus-4.5")
	 * - Others: generally unused
	 */
	arg?: string

	/**
	 * Optional model picker tab to open when using SetModel action
	 */
	tab?: "recommended" | "free"
}

/**
 * The list of predefined banner config rendered by the Welcome Section UI.
 * TODO: Backend would return a similar JSON structure in the future which we will replace this with.
 */

export const BANNER_DATA: BannerCardData[] = [
	// Guardian LLM API announcement
	{
		id: "guardian-llm-api-q2-2026",
		icon: "rocket",
		title: "Guardian LLM API Coming Q2 2026",
		description: "Our own high-performance LLM API designed specifically for coding tasks. Get early access and exclusive pricing.",
		actions: [
			{
				title: "Learn more",
				action: BannerActionType.Link,
				arg: "https://guardian-vs.dev/llm-api",
			},
		],
	},

	// Claude Sonnet 4.6 banner (updated)
	{
		id: "claude-sonnet-4-6-2026-feb-21",
		icon: "sparkles",
		title: "Try Claude Sonnet 4.6",
		description: "Anthropic's latest model with advanced reasoning and superior coding performance. Perfect for complex development tasks.",
		actions: [
			{
				title: "Use Sonnet 4.6",
				action: BannerActionType.SetModel,
				arg: "anthropic/claude-sonnet-4.6",
				tab: "recommended",
			},
		],
	},

	// Quickstart: Workflows & Todo
	{
		id: "quickstart-workflows-todo",
		icon: "list-checks",
		title: "Quickstart: Workflows & Todo",
		description: "Use `/deep-planning` for structured implementation. Guardian VS automatically creates todo lists and tracks progress as you work.",
		actions: [
			{
				title: "Try workflow",
				action: BannerActionType.ShowFeatureSettings,
			},
		],
	},

	// ChatGPT integration banner (updated)
	{
		id: "chatgpt-integration-v2",
		icon: "megaphone",
		title: "Connect Your ChatGPT Subscription",
		description: "Use GPT-5, GPT-4.5, and other OpenAI models directly through your existing ChatGPT Plus/Pro subscription.",
		actions: [
			{
				title: "Connect now",
				action: BannerActionType.ShowApiSettings,
				arg: "openai-codex",
			},
		],
	},

	// Platform-specific banner (Windows) - keeping as is
	{
		id: "cli-info-windows-v1",
		icon: "terminal",
		title: "Cline CLI Info",
		platforms: ["windows"] satisfies BannerCardData["platforms"],
		description:
			"Available for macOS and Linux. Coming soon to other platforms. [Learn more](https://docs.cline.bot/cline-cli/overview)",
	},

	// Info banner with inline link - keeping as is
	{
		id: "info-banner-v1",
		icon: "lightbulb",
		title: "Use Cline in Right Sidebar",
		description:
			"For the best experience, drag the Cline icon to your right sidebar. This keeps your file explorer and editor visible while you chat with Cline, making it easier to navigate your codebase and see changes in real-time. [See how →](https://docs.cline.bot/features/customization/opening-cline-in-sidebar)",
	},
]