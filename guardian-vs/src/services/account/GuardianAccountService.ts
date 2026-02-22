// Guardian Account Service - Stubbed out for production release
// All functionality has been removed to eliminate Guardian account dependencies

export class GuardianAccountService {
	private static instance: GuardianAccountService

	constructor() {}

	public static getInstance(): GuardianAccountService {
		if (!GuardianAccountService.instance) {
			GuardianAccountService.instance = new GuardianAccountService()
		}
		return GuardianAccountService.instance
	}

	get baseUrl(): string {
		return "https://api.guardianux.com"
	}

	async transcribeAudio(_audioBase64: string, _language = "en"): Promise<{ text: string }> {
		throw new Error("Guardian account transcription service is not available in this release")
	}

	// All other methods return undefined or throw errors
	async fetchBalanceRPC(): Promise<any> {
		return undefined
	}

	async fetchUsageTransactionsRPC(): Promise<any[]> {
		return []
	}

	async fetchPaymentTransactionsRPC(): Promise<any[]> {
		return []
	}

	async fetchMe(): Promise<any> {
		return undefined
	}

	async fetchUserOrganizationsRPC(): Promise<any[]> {
		return []
	}

	async fetchOrganizationCreditsRPC(_organizationId: string): Promise<any> {
		return undefined
	}

	async fetchOrganizationUsageTransactionsRPC(_organizationId: string): Promise<any[]> {
		return []
	}

	async switchAccount(_organizationId?: string): Promise<void> {
		throw new Error("Guardian account switching is not available in this release")
	}
}
