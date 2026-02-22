import type React from "react"
import styled from "styled-components"
import { useExtensionState } from "../../../../../context/ExtensionStateContext"

interface ChatLayoutProps {
	isHidden: boolean
	children: React.ReactNode
}

/**
 * Main layout container for the chat view
 * Provides the fixed positioning and flex layout structure
 */
export const ChatLayout: React.FC<ChatLayoutProps> = ({ isHidden, children }) => {
	const { isFullscreen } = useExtensionState()

	return (
		<ChatLayoutContainer isHidden={isHidden} isFullscreen={isFullscreen}>
			<MainContent isFullscreen={isFullscreen}>{children}</MainContent>
			{isFullscreen && (
				<FullscreenHint>
					Press <kbd>Esc</kbd> to exit fullscreen
				</FullscreenHint>
			)}
		</ChatLayoutContainer>
	)
}

const ChatLayoutContainer = styled.div.withConfig({
	shouldForwardProp: (prop) => !["isHidden", "isFullscreen"].includes(prop),
})<{ isHidden: boolean; isFullscreen: boolean }>`
	display: ${(props) => (props.isHidden ? "none" : "grid")};
	grid-template-rows: 1fr auto;
	overflow: hidden;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	position: relative;
	${(props) =>
		props.isFullscreen &&
		`
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		background: var(--vscode-editor-background);
		transition: all 0.3s ease;
	`}
`

const MainContent = styled.div<{ isFullscreen: boolean }>`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	grid-row: 1;
	${(props) =>
		props.isFullscreen &&
		`
		max-height: calc(100vh - 120px);
	`}
`

const FullscreenHint = styled.div`
	position: absolute;
	bottom: 10px;
	right: 10px;
	font-size: 11px;
	color: var(--vscode-descriptionForeground);
	opacity: 0.7;
	background: var(--vscode-editor-background);
	padding: 2px 6px;
	border-radius: 3px;
	pointer-events: none;
	transition: opacity 0.3s ease;
	z-index: 1001;

	&:hover {
		opacity: 1;
	}

	kbd {
		font-family: var(--vscode-font-family);
		font-size: 10px;
		padding: 1px 4px;
		border-radius: 3px;
		background: var(--vscode-editorWidget-background);
		border: 1px solid var(--vscode-widget-border);
	}
`
