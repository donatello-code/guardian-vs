export interface FocusChainSettings {
	// Enable/disable the focus chain feature
	enabled: boolean
	// Interval (in messages) to remind Guardian about focus chain
	remindGuardianInterval: number
}

export const DEFAULT_FOCUS_CHAIN_SETTINGS: FocusChainSettings = {
	enabled: true,
	remindGuardianInterval: 6,
}
