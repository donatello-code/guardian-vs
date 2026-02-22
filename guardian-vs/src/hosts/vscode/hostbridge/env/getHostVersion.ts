import { EmptyRequest } from "@shared/proto/guardian/common"
import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { GuardianClient } from "@/shared/guardian"
import { GetHostVersionResponse } from "@/shared/proto/index.host"

export async function getHostVersion(_: EmptyRequest): Promise<GetHostVersionResponse> {
	return {
		platform: vscode.env.appName,
		version: vscode.version,
		guardianType: GuardianClient.VSCode,
		guardianVersion: ExtensionRegistryInfo.version,
	}
}
