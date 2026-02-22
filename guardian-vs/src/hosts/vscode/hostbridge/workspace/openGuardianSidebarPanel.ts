import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { OpenGuardianSidebarPanelRequest, OpenGuardianSidebarPanelResponse } from "@/shared/proto/index.host"

export async function openGuardianSidebarPanel(_: OpenGuardianSidebarPanelRequest): Promise<OpenGuardianSidebarPanelResponse> {
	await vscode.commands.executeCommand(`${ExtensionRegistryInfo.views.Sidebar}.focus`)
	return {}
}
