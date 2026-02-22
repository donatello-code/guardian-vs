import type { BannerAction, BannerCardData } from "@shared/cline/banner"
import React from "react"
import Markdown from "react-markdown"

interface WhatsNewItemsProps {
	welcomeBanners?: BannerCardData[]
	onBannerAction?: (action: BannerAction) => void
	onClose: () => void
	inlineCodeStyle: React.CSSProperties
	onNavigateToModelPicker: (initialModelTab: "recommended" | "free", modelId?: string) => void
}

type InlineModelLinkProps = { pickerTab: "recommended" | "free"; modelId: string; label: string }

export const WhatsNewItems: React.FC<WhatsNewItemsProps> = ({
	welcomeBanners,
	onBannerAction,
	onClose,
	inlineCodeStyle,
	onNavigateToModelPicker,
}) => {
	const InlineModelLink: React.FC<InlineModelLinkProps> = ({ pickerTab, modelId, label }) => (
		<span
			onClick={() => onNavigateToModelPicker(pickerTab, modelId)}
			style={{ color: "var(--vscode-textLink-foreground)", cursor: "pointer" }}>
			{label}
		</span>
	)

	const hasWelcomeBanners = welcomeBanners && welcomeBanners.length > 0

	return (
		<ul className="text-sm pl-3 list-disc" style={{ color: "var(--vscode-descriptionForeground)" }}>
			{hasWelcomeBanners ? (
				welcomeBanners.map((banner) => (
					<li className="mb-2" key={banner.id}>
						{banner.title && <strong>{banner.title}</strong>}{" "}
						{banner.description && (
							<Markdown
								components={{
									a: ({ href, children }) => (
										<a
											href={href}
											rel="noopener noreferrer"
											style={{ color: "var(--vscode-textLink-foreground)" }}
											target="_blank">
											{children}
										</a>
									),
									code: ({ children }) => <code style={inlineCodeStyle}>{children}</code>,
									p: ({ children }) => <p style={{ display: "inline", margin: 0 }}>{children}</p>,
								}}>
								{banner.description}
							</Markdown>
						)}
						{banner.actions && banner.actions.length > 0 && onBannerAction && (
							<span className="inline-flex gap-2 ml-2 align-middle">
								{banner.actions.map((action, idx) => (
									<a
										href="#"
										key={idx}
										onClick={(event) => {
											event.preventDefault()
											onBannerAction(action)
											onClose()
										}}
										style={{
											color: "var(--vscode-textLink-foreground)",
											cursor: "pointer",
										}}>
										{action.title}
									</a>
								))}
							</span>
						)}
					</li>
				))
			) : (
				<>
					{/* Hardcoded fallback items shown when remote welcome banners feature flag is off */}
					<li className="mb-2">
						<strong>Welcome to Guardian VS!</strong> Your AI coding partner that thinks like a developer. I can edit files, run commands, browse the web, and more—always with your permission.{" "}
						<a
							href="#"
							onClick={(event) => {
								event.preventDefault()
								// This would need to be connected to open the walkthrough
								console.log("Take a Tour clicked")
							}}
							style={{ color: "var(--vscode-textLink-foreground)", cursor: "pointer" }}>
							Take a Tour
						</a>
					</li>
					<li className="mb-2">
						<strong>Start with any coding goal</strong> - Describe what you want to build or fix. I'll plan, ask questions, and execute step-by-step like a true development partner.
					</li>
					<li className="mb-2">
						<strong>Connect to top AI models</strong> - Use Claude Sonnet, Gemini, GPT, and more through our integrated providers. Configure your API key to get started.{" "}
						<span
							onClick={() => onNavigateToModelPicker("recommended")}
							style={{ color: "var(--vscode-textLink-foreground)", cursor: "pointer" }}>
							Set up API
						</span>
					</li>
				</>
			)}
		</ul>
	)
}

export default WhatsNewItems