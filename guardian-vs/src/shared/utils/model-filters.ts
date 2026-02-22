import type { ApiProvider } from "@shared/api"

/**
 * Filters OpenRouter model IDs based on provider-specific rules.
 * For Guardian provider: excludes :free models (except Minimax and Devstral models)
 * For OpenRouter/Vercel: excludes guardian/ prefixed models
 * @param modelIds Array of model IDs to filter
 * @param provider The current API provider
 * @returns Filtered array of model IDs
 */
export function filterOpenRouterModelIds(modelIds: string[], provider: ApiProvider): string[] {
	if (provider === "guardian") {
		// For Guardian provider: exclude :free models, but keep Minimax and Devstral models
		return modelIds.filter((id) => {
			// Keep all Minimax and devstral models regardless of :free suffix
			if (id.toLowerCase().includes("minimax-m2") || id.toLowerCase().includes("devstral-2512")) {
				return true
			}
			// Filter out other :free models
			return !id.includes(":free")
		})
	}

	// For OpenRouter and Vercel AI Gateway providers: exclude Guardian-specific models
	return modelIds.filter((id) => !id.startsWith("guardian/"))
}
