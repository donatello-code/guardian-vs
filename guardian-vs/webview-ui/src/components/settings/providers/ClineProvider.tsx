import { Mode } from "@shared/storage/types"
import { GuardianAccountInfoCard } from "../GuardianAccountInfoCard"
import OpenRouterModelPicker from "../OpenRouterModelPicker"

/**
 * Props for the GuardianProvider component
 */
interface GuardianProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
	initialModelTab?: "recommended" | "free"
}

/**
 * The Guardian provider configuration component
 */
export const GuardianProvider = ({ showModelOptions, isPopup, currentMode, initialModelTab }: GuardianProviderProps) => {
	return (
		<div>
			{/* Guardian Account Info Card */}
			<div style={{ marginBottom: 14, marginTop: 4 }}>
				<GuardianAccountInfoCard />
			</div>

			{showModelOptions && (
				<>
					{/* OpenRouter Model Picker - includes Provider Routing in Advanced section */}
					<OpenRouterModelPicker
						currentMode={currentMode}
						initialTab={initialModelTab}
						isPopup={isPopup}
						showProviderRouting={true}
					/>
				</>
			)}
		</div>
	)
}
