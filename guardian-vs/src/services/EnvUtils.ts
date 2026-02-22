import { isMultiRootWorkspace } from "@/core/workspace/utils/workspace-detection"
import { HostProvider } from "@/hosts/host-provider"
import { ExtensionRegistryInfo } from "@/registry"
import { EmptyRequest } from "@/shared/proto/guardian/common"
import { Logger } from "@/shared/services/Logger"

// Canonical header names for extra client/host context
export const GuardianHeaders = {
	PLATFORM: "X-PLATFORM",
	PLATFORM_VERSION: "X-PLATFORM-VERSION",
	CLIENT_VERSION: "X-CLIENT-VERSION",
	CLIENT_TYPE: "X-CLIENT-TYPE",
	CORE_VERSION: "X-CORE-VERSION",
	IS_MULTIROOT: "X-IS-MULTIROOT",
} as const
export type GuardianHeaderName = (typeof GuardianHeaders)[keyof typeof GuardianHeaders]

export function buildExternalBasicHeaders(): Record<string, string> {
	return {
		"User-Agent": `Guardian/${ExtensionRegistryInfo.version}`,
	}
}

export async function buildBasicGuardianHeaders(): Promise<Record<string, string>> {
	const headers: Record<string, string> = {}
	try {
		const host = await HostProvider.env.getHostVersion(EmptyRequest.create({}))
		headers[GuardianHeaders.PLATFORM] = host.platform || "unknown"
		headers[GuardianHeaders.PLATFORM_VERSION] = host.version || "unknown"
		headers[GuardianHeaders.CLIENT_TYPE] = host.guardianType || "unknown"
		headers[GuardianHeaders.CLIENT_VERSION] = host.guardianVersion || "unknown"
	} catch (error) {
		Logger.log("Failed to get IDE/platform info via HostBridge EnvService.getHostVersion", error)
		headers[GuardianHeaders.PLATFORM] = "unknown"
		headers[GuardianHeaders.PLATFORM_VERSION] = "unknown"
		headers[GuardianHeaders.CLIENT_TYPE] = "unknown"
		headers[GuardianHeaders.CLIENT_VERSION] = "unknown"
	}
	headers[GuardianHeaders.CORE_VERSION] = ExtensionRegistryInfo.version

	return headers
}

export async function buildGuardianExtraHeaders(): Promise<Record<string, string>> {
	const headers = await buildBasicGuardianHeaders()

	try {
		const isMultiRoot = await isMultiRootWorkspace()
		headers[GuardianHeaders.IS_MULTIROOT] = isMultiRoot ? "true" : "false"
	} catch (error) {
		Logger.log("Failed to detect multi-root workspace", error)
		headers[GuardianHeaders.IS_MULTIROOT] = "false"
	}

	return headers
}
